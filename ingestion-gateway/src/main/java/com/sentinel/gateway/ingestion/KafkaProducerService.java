package com.sentinel.gateway.ingestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC = "moderation-requests";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishRequest(String trackingId, String normalizedPayload) {
        try {
            Map<String, String> event = Map.of(
                "trackingId", trackingId,
                "payload", normalizedPayload
            );
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, trackingId, message);
            logger.info("Published request {} to topic {}", trackingId, TOPIC);
        } catch (Exception e) {
            logger.error("Failed to publish request {}", trackingId, e);
        }
    }
}
