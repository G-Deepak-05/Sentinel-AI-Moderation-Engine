from fastapi import FastAPI
import asyncio
from kafka_service import consume_and_process

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consume_and_process())

@app.get("/health")
def health():
    return {"status": "up"}
