const express      = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const sqlite3      = require('sqlite3').verbose();
const { handler }  = require('./lambda');
const { Kafka }    = require('kafkajs');

// ── DB setup ─────────────────────────────────────────────────────────────
const dbFile = path.join(__dirname, 'orderbook.db');
const db     = new sqlite3.Database(dbFile);
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id               TEXT PRIMARY KEY,
      market_id              TEXT,
      option_id              TEXT,
      side                   TEXT,
      all_or_nothing         INTEGER,
      original_quantity      INTEGER,
      remaining_quantity     INTEGER,
      order_type             TEXT,
      price                  REAL,
      status                 TEXT,
      order_timestamp        TEXT,
      last_updated_timestamp TEXT,
      time_in_force          TEXT,
      order_expiration       TEXT
    )
  `);
});

const app = express();
app.use(bodyParser.json());

// ── 1) Ingestion ─────────────────────────────────────────────────────────
app.post('/markets/:marketId/orders', async (req, res) => {
  const event = {
    pathParameters: { marketId: req.params.marketId },
    body: JSON.stringify(req.body)
  };
  try {
    const lambdaRes = await handler(event);
    const o = JSON.parse(lambdaRes.body);

    db.run(
      `INSERT OR REPLACE INTO orders (
         order_id, market_id, option_id, side, all_or_nothing,
         original_quantity, remaining_quantity, order_type,
         price, status, order_timestamp, last_updated_timestamp,
         time_in_force, order_expiration
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.order_id,
        o.market_id,
        o.option_id,
        o.side,
        o.all_or_nothing ? 1 : 0,
        o.original_quantity,
        o.remaining_quantity,
        o.order_type,
        o.price,
        o.status,
        o.order_timestamp,
        o.last_updated_timestamp,
        o.time_in_force,
        o.order_expiration
      ]
    );

    res.status(200).json(o);
  } catch (err) {
    console.error('Ingestion Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── 2) Trade consumer ────────────────────────────────────────────────────
const kafka        = new Kafka({ brokers: [ process.env.KAFKA_BROKER || 'localhost:9092' ] });
const consumer     = kafka.consumer({ groupId: 'trade-updater' });

;(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'trades', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const t = JSON.parse(message.value.toString());
      ['buy_order_id','sell_order_id'].forEach(oidKey => {
        const oid = t[oidKey];
        db.get(
          `SELECT remaining_quantity FROM orders WHERE order_id = ?`,
          [oid],
          (e, row) => {
            if (e || !row) return console.error('DB Select Error:', e);
            const rem    = row.remaining_quantity - t.quantity;
            const status = rem > 0 ? 'partial' : 'filled';
            const ts     = new Date().toISOString();
            db.run(
              `UPDATE orders
                 SET remaining_quantity = ?, status = ?, last_updated_timestamp = ?
               WHERE order_id = ?`,
              [Math.max(rem, 0), status, ts, oid]
            );
          }
        );
      });
    }
  });
})();

// ── 3) Live‑order endpoint ────────────────────────────────────────────────
app.get('/orderbook', (req, res) => {
  const { market, option } = req.query;
  db.all(
    `SELECT * FROM orders
       WHERE market_id = ? AND option_id = ? AND remaining_quantity > 0
       ORDER BY price DESC`,
    [market, option],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ── 4) Cancel endpoint ───────────────────────────────────────────────────
app.post('/orders/:orderId/cancel', (req, res) => {
  const orderId = req.params.orderId;
  const ts      = new Date().toISOString();
  db.run(
    `UPDATE orders
       SET remaining_quantity = 0,
           status = 'cancelled',
           last_updated_timestamp = ?
     WHERE order_id = ?`,
    [ts, orderId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
      res.json({ order_id: orderId, status: 'cancelled', last_updated_timestamp: ts });
    }
  );
});

// ── 5) Static hosting ───────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/submitorder/'));
app.use('/submitorder',   express.static(path.join(__dirname, '..', 'client', 'submitorder')));
app.use('/liveorderbook', express.static(path.join(__dirname, '..', 'client', 'liveorderbook')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
