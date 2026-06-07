# Sentinel-AI Moderation Engine

Sentinel-AI is a real-time, asynchronous content moderation pipeline designed to detect and triage toxic user-generated content. It acts as a scalable middleware system that ingests high-volume text streams, normalizes adversarial obfuscation, runs ML inference, and routes actionable items to a moderator dashboard.

## 🚀 Quick Start

Ensure you have Docker and Docker Compose installed.

1. **Start the Infrastructure**
   ```bash
   docker-compose up --build -d
   ```
   This will spin up PostgreSQL, Confluent Kafka (KRaft mode), the Spring Boot Ingestion Gateway, the Python ML Inference Worker, the Next.js Moderation Dashboard, and a mock Webhook Receiver.

2. **Verify Services are Running**
   - **Moderation Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Ingestion API:** `http://localhost:8081`
   - **Webhook Receiver:** `http://localhost:8080`

## 🛠️ Usage Guide

### 1. Send a Message for Moderation
You can simulate a user posting a comment by sending a POST request to the Ingestion Gateway:

```bash
curl -X POST http://localhost:8081/api/v1/moderate \
  -H "Content-Type: application/json" \
  -d '{"payload": "You are stupid!"}'
```

The gateway will immediately return an `ACCEPTED` response with a unique `trackingId`. Behind the scenes, the request is published to Kafka.

### 2. The Triaging Process
The Python Inference Worker picks up the message from Kafka and runs it through a mock ML model that assigns a toxicity score between 0.0 and 1.0. 

Depending on the score, the system automatically takes one of three actions:
* **`BLOCK` (Score > 0.8):** The content is highly toxic. It is automatically blocked.
* **`ALLOW` (Score < 0.4):** The content is safe. It is automatically allowed.
* **`FLAG` (Score 0.4 - 0.8):** The AI is uncertain. The content is flagged for human review.

### 3. Review Flagged Content
Open the **[Trust & Safety Dashboard](http://localhost:3000)**. 
Because the mock model generates random scores, you may need to send the `curl` command a few times until a request falls into the `FLAG` threshold.

Once a request is flagged, it will appear in the dashboard queue. As a human moderator, you can click **Approve** or **Reject**. This manual decision is recorded in the `audit_logs` table for future ML model retraining.

## 🏗️ Architecture

* **Ingestion Gateway (Spring Boot 3.3, Java 21):** Exposes the REST API, normalizes text (e.g. converting "b@d w0rd" to "bad word"), and handles transactional outbox event publishing via Spring Modulith.
* **Inference Worker (Python, FastAPI, AIOKafka):** Consumes requests, runs ML evaluations, and publishes moderation results.
* **Dashboard (Next.js 14, TailwindCSS, PostgreSQL):** A modern React UI that queries the PostgreSQL database for items awaiting review.
* **Message Broker (Confluent Kafka):** Decouples the fast Java ingestion layer from the computationally heavy Python ML layer.
* **Database (PostgreSQL 16):** Stores moderation requests, results, and human review audit logs.
