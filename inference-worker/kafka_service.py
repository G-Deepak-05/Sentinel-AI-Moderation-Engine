import json
import asyncio
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from model import ModerationModel
import os

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9094")
REQUEST_TOPIC = "moderation-requests"
RESULT_TOPIC = "moderation-results"

model = ModerationModel()

async def consume_and_process():
    consumer = AIOKafkaConsumer(
        REQUEST_TOPIC,
        bootstrap_servers=KAFKA_BROKER,
        group_id="inference-worker-group",
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BROKER,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    # Wait for Kafka to be ready
    for _ in range(10):
        try:
            await consumer.start()
            await producer.start()
            print("Successfully connected to Kafka")
            break
        except Exception as e:
            print(f"Failed to connect to Kafka, retrying... ({e})")
            await asyncio.sleep(5)
    else:
        print("Could not connect to Kafka. Exiting...")
        return
    
    try:
        async for msg in consumer:
            payload = msg.value
            tracking_id = payload.get("trackingId")
            text = payload.get("payload", "")
            
            print(f"Received request {tracking_id}")
            
            result = model.evaluate(text)
            result["trackingId"] = tracking_id
            
            await producer.send_and_wait(RESULT_TOPIC, result)
            print(f"Published result for {tracking_id} with action {result['action']}")
    finally:
        await consumer.stop()
        await producer.stop()
