import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_SASL_MECHANISM
    ? {
        mechanism: process.env.KAFKA_SASL_MECHANISM,
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
      }
    : undefined
});

export const producer = kafka.producer();
let isConnected = false;

export async function ensureProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
}