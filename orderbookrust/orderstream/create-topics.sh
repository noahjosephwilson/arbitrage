#!/usr/bin/env bash
# orderbook/orderstream/create-topics.sh
docker compose exec kafka \
  kafka-topics --create \
    --topic orders \
    --bootstrap-server localhost:9092 \
    --partitions 10 \
    --replication-factor 1

docker compose exec kafka \
  kafka-topics --create \
    --topic trades \
    --bootstrap-server localhost:9092 \
    --partitions 10 \
    --replication-factor 1
