import { ensureProducer, producer } from './kafkaClient.js';

export const handler = async (event) => {
  let order;
  try {
    order = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON payload' }) };
  }

  const now = new Date().toISOString();
  order.Order_Timestamp = now;
  order.Last_Updated_Timestamp = now;

  const message = { key: order.OrderID, value: JSON.stringify(order) };

  try {
    await ensureProducer();
    await producer.send({ topic: process.env.KAFKA_TOPIC, messages: [message] });
    return { statusCode: 202, body: JSON.stringify({ status: 'ACCEPTED', OrderID: order.OrderID }) };
  } catch (err) {
    console.error('Kafka publish error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to publish order' }) };
  }
};