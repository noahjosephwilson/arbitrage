package main

import (
  "context"
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "sync"
  "time"

  "github.com/segmentio/kafka-go"
)

type Order struct {
  OrderID                string  `json:"OrderID"`
  MarketID               string  `json:"MarketID"`
  OptionID               string  `json:"OptionID"`
  Side                   string  `json:"Side"`
  AllOrNothing           bool    `json:"All_Or_Nothing"`
  Quantity               int     `json:"Quantity"`
  RemainingQuantity      int     `json:"Remaining_Quantity"`
  OrderType              string  `json:"Order_Type"`
  Price                  float64 `json:"Price"`
  Status                 string  `json:"Status"`
  OrderTimestamp         string  `json:"Order_Timestamp"`
  LastUpdatedTimestamp   string  `json:"Last_Updated_Timestamp"`
  TimeInForce            string  `json:"Time_In_Force"`
  OrderExpiration        string  `json:"Order_Expiration"`
}

var (
  orders   []Order
  ordersMu sync.Mutex
)

func main() {
  writer := kafka.NewWriter(kafka.WriterConfig{
    Brokers:  []string{"localhost:9092"},
    Topic:    "orders",
    Balancer: &kafka.Hash{},
  })
  defer writer.Close()

  // handle POST /order and its OPTIONS
  http.HandleFunc("/order", func(w http.ResponseWriter, r *http.Request) {
    // ——— CORS preflight ———
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusOK)
      return
    }

    if r.Method != http.MethodPost {
      http.Error(w, "only POST allowed", http.StatusMethodNotAllowed)
      return
    }

    var ord Order
    if err := json.NewDecoder(r.Body).Decode(&ord); err != nil {
      http.Error(w, "invalid JSON: "+err.Error(), http.StatusBadRequest)
      return
    }

    ordersMu.Lock()
    orders = append(orders, ord)
    ordersMu.Unlock()

    msg, _ := json.Marshal(ord)
    if err := writer.WriteMessages(
      context.Background(),
      kafka.Message{Key: []byte(ord.OrderID), Value: msg, Time: time.Now()},
    ); err != nil {
      http.Error(w, "kafka error: "+err.Error(), http.StatusInternalServerError)
      return
    }

    fmt.Fprintf(w, "sent order %s\n", ord.OrderID)
  })

  // handle GET /orders and its OPTIONS
  http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusOK)
      return
    }
    if r.Method != http.MethodGet {
      http.Error(w, "only GET allowed", http.StatusMethodNotAllowed)
      return
    }

    ordersMu.Lock()
    defer ordersMu.Unlock()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(orders)
  })

  log.Println("ingestion service listening on :8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}
