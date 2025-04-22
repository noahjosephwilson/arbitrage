const { Kafka, Partitioners } = require('kafkajs');
const kafka = new Kafka({
  brokers: [ process.env.KAFKA_BROKER || 'localhost:9092' ]
});
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
let isConnected = false;

async function ensureProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
}

exports.handler = async (event) => {
  await ensureProducer();
  const order = JSON.parse(event.body);
  const ts    = new Date().toISOString();

  const enriched = {
    ...order,
    market_id:            event.pathParameters.marketId,
    remaining_quantity:   order.quantity,
    original_quantity:    order.quantity,
    status:               'open',
    order_timestamp:      ts,
    last_updated_timestamp: ts
  };

  await producer.send({
    topic: 'orders',
    messages: [
      {
        key:   `${enriched.market_id}-${enriched.option_id}`,
        value: JSON.stringify(enriched)
      }
    ]
  });

  return {
    statusCode: 200,
    body:       JSON.stringify(enriched)
  };
};
