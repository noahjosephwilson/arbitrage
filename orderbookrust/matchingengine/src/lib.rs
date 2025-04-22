use std::collections::{BTreeMap, VecDeque};
use ordered_float::OrderedFloat;
use serde::Deserialize;

/// Incoming order from Kafka — now includes option_id
#[derive(Debug, Deserialize, Clone)]
pub struct Order {
    pub order_id:    String,
    pub market_id:   String,
    pub option_id:   String,
    pub side:        String,
    pub price:       f64,
    pub quantity:    u64,
    pub timestamp:   String,
}

/// A single execution event — now includes option_id
pub struct TradeExec {
    pub market_id:    String,
    pub option_id:    String,
    pub buy_order_id: String,
    pub sell_order_id:String,
    pub price:        f64,
    pub quantity:     u64,
}

/// In‑memory FIFO book per option
pub struct OrderBook {
    buys:  BTreeMap<OrderedFloat<f64>, VecDeque<Order>>,
    sells: BTreeMap<OrderedFloat<f64>, VecDeque<Order>>,
}

impl OrderBook {
    pub fn new() -> Self {
        Self {
            buys:  BTreeMap::new(),
            sells: BTreeMap::new(),
        }
    }

    /// Process a raw order and return any match executions
    pub fn process_with_trades(&mut self, mut order: Order) -> Vec<TradeExec> {
        let mut execs = Vec::new();
        let key = OrderedFloat(order.price);
        let (own, opp, is_buy) = if order.side.eq_ignore_ascii_case("buy") {
            (&mut self.buys, &mut self.sells, true)
        } else {
            (&mut self.sells, &mut self.buys, false)
        };

        let mut remaining = order.quantity;
        let mut emptied = Vec::new();

        for (&price_key, queue) in opp.iter_mut() {
            let price = price_key.0;
            let valid = if is_buy {
                price <= order.price
            } else {
                price >= order.price
            };
            if !valid || remaining == 0 {
                break;
            }

            while remaining > 0 && !queue.is_empty() {
                let head = queue.front_mut().unwrap();
                let exec_qty = remaining.min(head.quantity);

                execs.push(TradeExec {
                    market_id:     order.market_id.clone(),
                    option_id:     order.option_id.clone(),
                    buy_order_id:  if is_buy { order.order_id.clone() } else { head.order_id.clone() },
                    sell_order_id: if is_buy { head.order_id.clone() } else { order.order_id.clone() },
                    price,
                    quantity:      exec_qty,
                });

                head.quantity -= exec_qty;
                remaining    -= exec_qty;
                if head.quantity == 0 {
                    queue.pop_front();
                }
            }
            if queue.is_empty() {
                emptied.push(price_key);
            }
        }
        for k in emptied {
            opp.remove(&k);
        }

        if remaining > 0 {
            order.quantity = remaining;
            own.entry(key)
               .or_insert_with(VecDeque::new)
               .push_back(order);
        }

        execs
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_with_trades() {
        let mut book = OrderBook::new();
        let sell = Order {
            order_id:   "s1".into(),
            market_id:  "MKT".into(),
            option_id:  "OPT1".into(),
            side:       "sell".into(),
            price:      100.0,
            quantity:   10,
            timestamp:  "".into(),
        };
        let buy = Order {
            order_id:   "b1".into(),
            market_id:  "MKT".into(),
            option_id:  "OPT1".into(),
            side:       "buy".into(),
            price:      105.0,
            quantity:   5,
            timestamp:  "".into(),
        };

        // First, no matching sell orders in an empty book:
        let execs = book.process_with_trades(sell);
        assert!(execs.is_empty());

        // Now the buy should match the queued sell at price 100.0 for qty 5:
        let execs = book.process_with_trades(buy);
        assert_eq!(execs.len(), 1);

        let e = &execs[0];
        assert_eq!(e.market_id, "MKT");
        assert_eq!(e.option_id, "OPT1");
        assert_eq!(e.price, 100.0);
        assert_eq!(e.quantity, 5);
    }
}
