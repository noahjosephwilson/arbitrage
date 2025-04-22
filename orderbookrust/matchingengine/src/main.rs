use std::{collections::HashMap, sync::Arc, time::Duration};
use futures_util::StreamExt;
use rdkafka::{ClientConfig, Message};
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::producer::{FutureProducer, FutureRecord};
use serde_json::{json, from_slice};
use tokio::{sync::{mpsc, Mutex}, task};
use chrono::Utc;

use matchingengine::{Order, OrderBook};

#[tokio::main]
async fn main() {
    // Consumer for raw orders
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", "matcher-group")
        .set("bootstrap.servers", "localhost:9092")
        .set("auto.offset.reset", "earliest")
        .create()
        .expect("Failed to create Kafka consumer");
    consumer.subscribe(&["orders"]).expect("Subscribe failed");

    // Producer for trade events
    let producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .create()
        .expect("Failed to create Kafka producer");

    // One channel per (market_id, option_id) book
    let books = Arc::new(Mutex::new(HashMap::<String, mpsc::Sender<Order>>::new()));
    let mut stream = consumer.stream();

    while let Some(Ok(msg)) = stream.next().await {
        let order: Order = from_slice(msg.payload().unwrap()).unwrap();
        let book_key = format!("{}-{}", order.market_id, order.option_id);

        let tx = {
            let mut map = books.lock().await;
            map.entry(book_key.clone()).or_insert_with(|| {
                let (tx, mut rx) = mpsc::channel::<Order>(1024);
                let prod = producer.clone();
                let bk   = book_key.clone();

                task::spawn(async move {
                    let mut ob = OrderBook::new();
                    println!("[{}] matcher started", bk);
                    while let Some(o) = rx.recv().await {
                        let execs = ob.process_with_trades(o);
                        for e in execs {
                            println!("[MATCH] {} {} @ {}", e.option_id, e.quantity, e.price);
                            let msg = json!({
                                "market_id":     e.market_id,
                                "option_id":     e.option_id,
                                "buy_order_id":  e.buy_order_id,
                                "sell_order_id": e.sell_order_id,
                                "price":         e.price,
                                "quantity":      e.quantity,
                                "timestamp":     Utc::now().to_rfc3339(),
                            });
                            let _ = prod.send(
                                FutureRecord::to("trades")
                                    .key(&e.market_id)
                                    .payload(&msg.to_string()),
                                Duration::from_secs(0),
                            ).await;
                        }
                    }
                });
                tx
            }).clone()
        };

        if tx.send(order).await.is_err() {
            eprintln!("Channel closed for book {}", book_key);
        }
    }
}
