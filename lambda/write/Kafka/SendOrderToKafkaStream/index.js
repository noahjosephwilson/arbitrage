// orderHandler.js

import { Kafka } from 'kafkajs';

// Configure Kafka client via environment variables
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS.split(','),       // e.g. "b-1.msk...:9092,b-2.msk...:9092"
  ssl: process.env.KAFKA_SSL === 'true',                // set to 'true' to enable TLS
  sasl: process.env.KAFKA_SASL_MECHANISM
    ? {
        mechanism: process.env.KAFKA_SASL_MECHANISM,    // e.g. 'plain'
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
      }
    : undefined,
});

// Reuse producer between invocations to reduce handshake overhead
const producer = kafka.producer();
let isConnected = false;

async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
}

// Lambda handler
export const handler = async (event) => {
  // 1. Parse incoming JSON
  let order;
  try {
    order = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON received:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  // 2. Stamp timestamps
  const now = new Date().toISOString();
  order.Order_Timestamp = now;
  order.Last_Updated_Timestamp = now;

  // 3. Build Kafka message
  const message = {
    key: order.OrderID,
    value: JSON.stringify(order),
  };

  // 4. Send to Kafka
  try {
    await connectProducer();
    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'orders',
      messages: [message],
    });

    // 5. Return success
    return {
      statusCode: 202,
      body: JSON.stringify({ status: 'ACCEPTED', OrderID: order.OrderID }),
    };
  } catch (err) {
    console.error('Failed to send to Kafka:', err);
    // Optionally push to a DLQ here
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to publish order' }),
    };
  }
};
