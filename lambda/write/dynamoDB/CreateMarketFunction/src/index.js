"use strict";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Markets";

// A helper zero binary which is allowed to be reused.
const ZERO_BINARY = Buffer.from([0]);

export const handler = async (event) => {
  try {
    // Parse the incoming payload.
    const data = (typeof event.body === "string") ? JSON.parse(event.body) : event;
    const { DATA } = data;
    // Read the updated field "ImageUrl" from the payload.
    const { MarketName, Options, ImageUrl, Volume } = data.attributes;
    
    // Generate a new MARKETID as a binary value.
    const marketIdString = randomUUID();
    const marketIdBinary = Buffer.from(marketIdString.replace(/-/g, ""), "hex");

    // Generate new options with binary OptionIDs.
    const newOptions = Options.map(opt => {
      const optionIdString = randomUUID();
      const optionIdBinary = Buffer.from(optionIdString.replace(/-/g, ""), "hex");
      return {
        OptionID: optionIdBinary,  // Stored as binary.
        OptionName: opt.OptionName,
        ChoiceName1: opt.ChoiceName1,
        ChoiceName2: opt.ChoiceName2,
        Choice1Value: opt.Choice1Value,
        Choice2Value: opt.Choice2Value
      };
    });

    // === Check that MARKETID is not already used ===
    const getMetadataCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        MARKETID: marketIdBinary,
        DATA: ZERO_BINARY
      }
    });
    const existingMarket = await ddbDocClient.send(getMetadataCommand);
    if (existingMarket.Item) {
      // An item with the same MARKETID (and metadata sort key) already exists.
      return {
        statusCode: 409, // Conflict.
        body: JSON.stringify({
          message: "Market with this MARKETID already exists, not creating a duplicate."
        })
      };
    }

    // === Check that each OptionID is not already used ===
    for (const opt of newOptions) {
      // Skip the check if the OptionID is our allowed ZERO_BINARY.
      if (opt.OptionID.equals(ZERO_BINARY)) continue;

      const scanParams = {
        TableName: TABLE_NAME,
        FilterExpression: "#D = :optionId",
        ExpressionAttributeNames: {
          "#D": "DATA"
        },
        ExpressionAttributeValues: {
          ":optionId": opt.OptionID
        }
      };
      const scanResult = await ddbDocClient.send(new ScanCommand(scanParams));
      if (scanResult.Count && scanResult.Count > 0) {
        return {
          statusCode: 409, // Conflict.
          body: JSON.stringify({
            message: "An OptionID already exists in the table, not creating a duplicate."
          })
        };
      }
    }

    // === Build the Metadata Item ===
    const metadataItem = {
      MARKETID: marketIdBinary,     // Partition key as binary.
      DATA: ZERO_BINARY,             // Metadata sort key as binary 0.
      Name: MarketName,
      ImageUrl,                    // Store the S3 image URL here.
      Volume,
      Options: newOptions.map(opt => opt.OptionID)  // List of OptionIDs (binaries).
    };

    // Use a condition expression with ExpressionAttributeNames for reserved words.
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: metadataItem,
      ConditionExpression: "attribute_not_exists(MARKETID) AND attribute_not_exists(#D)",
      ExpressionAttributeNames: {
        "#D": "DATA"
      }
    }));

    // === Prepare Option Items ===
    // Each option item uses the same MARKETID and its own OptionID as the sort key.
    const optionItems = newOptions.map(opt => ({
      PutRequest: {
        Item: {
          MARKETID: marketIdBinary,
          DATA: opt.OptionID, // For options, the sort key is the binary OptionID.
          OptionName: opt.OptionName,
          Choice1: opt.ChoiceName1,
          Choice2: opt.ChoiceName2,
          Choice1Value: opt.Choice1Value,
          Choice2Value: opt.Choice2Value
        }
      }
    }));

    // Write all option items using a batch write.
    await ddbDocClient.send(new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: optionItems
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Market created successfully",
        MARKETID: marketIdBinary.toString("hex") // Optionally, return the hex string form.
      })
    };

  } catch (error) {
    // If the error is due to the conditional check on the metadata item.
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Market with this primary key already exists."
        })
      };
    }
    console.error("Error processing market creation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating market",
        error: error.message
      })
    };
  }
};
