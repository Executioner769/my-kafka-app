# my-kafka-app

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


### Linux Commands to run before running the application

```bash
docker run -p 2181:2181 zookeeper
```

```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=192.168.29.200:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.29.200:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```