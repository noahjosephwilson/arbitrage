import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

/* ─────────── CONFIG ─────────── */
const TABLE_NAME = "Markets";
const ZERO_BINARY = Buffer.from([0]);

/* ─────────── AWS SDK setup ─────────── */
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(client);

/* ─────────── helpers to convert Buffers ⇆ base64 ─────────── */
const toB64 = (buf) => (Buffer.isBuffer(buf) ? buf.toString("base64") : buf);

const convertToBase64 = (data) => {
  if (Buffer.isBuffer(data)) return data.toString("base64");
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.every((k) => /^\d+$/.test(k))) {
      const arr = keys.sort((a, b) => +a - +b).map((k) => data[k]);
      return Buffer.from(arr).toString("base64");
    }
  }
  return data;
};

const deepConvert = (x) => {
  if (Buffer.isBuffer(x)) return x.toString("base64");
  if (Array.isArray(x)) return x.map(deepConvert);
  if (x && typeof x === "object") {
    const keys = Object.keys(x);
    if (keys.every((k) => /^\d+$/.test(k))) {
      const arr = keys.sort((a, b) => +a - +b).map((k) => x[k]);
      return Buffer.from(arr).toString("base64");
    }
    return Object.fromEntries(keys.map((k) => [k, deepConvert(x[k])]));
  }
  return x;
};

/* ─────────── Lambda handler ─────────── */
export const handler = async (event) => {
  // Parse input
  const isGet = event.httpMethod === "GET";
  let payload;
  try {
    payload = isGet
      ? event.queryStringParameters || {}
      : typeof event.body === "string"
      ? JSON.parse(event.body)
      : event;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Malformed JSON body", error: e.message }),
    };
  }

  const { marketID } = payload;
  if (!marketID || typeof marketID !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid marketID", received: marketID }),
    };
  }

  // Decode base64 to Buffer
  let buf;
  try {
    buf = Buffer.from(marketID, "base64");
    if (!buf.length) throw new Error("Decoded buffer is empty");
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "marketID not Base64", error: e.message }),
    };
  }

  // Fetch top-level item
  let Item;
  try {
    const result = await ddb.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { MARKETID: buf, DATA: ZERO_BINARY } })
    );
    Item = result.Item;
    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Market not found", marketID }),
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching market", error: e.message }),
    };
  }

  // Fetch option details
  const rawOpts = Array.isArray(Item.Options) ? Item.Options : [];
  let optionDetails = [];

  try {
    optionDetails = (
      await Promise.all(
        rawOpts.map(async (opt) => {
          const keyBuf = Buffer.isBuffer(opt)
            ? opt
            : Buffer.from(
                Object.keys(opt)
                  .sort((a, b) => +a - +b)
                  .map((k) => opt[k])
              );

          const res = await ddb.send(
            new GetCommand({ TableName: TABLE_NAME, Key: { MARKETID: buf, DATA: keyBuf } })
          );

          if (res.Item) {
            return { optionID: toB64(res.Item.DATA), ...res.Item };
          } else {
            return null;
          }
        })
      )
    ).filter(Boolean);
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching options", error: e.message }),
    };
  }

  // Build and return response
  const out = {
    marketID,
    name: Item.Name,
    imageUrl: Item.ImageUrl,
    volume: Item.Volume,
    options: rawOpts.map(convertToBase64),
    optionDetails,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ market: deepConvert(out) }),
  };
};
