package com.sentinel.gateway.ingestion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/moderate")
public class IngestionController {

    private final TextNormalizationService normalizationService;
    private final KafkaProducerService kafkaProducerService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public IngestionController(TextNormalizationService normalizationService, KafkaProducerService kafkaProducerService, org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.normalizationService = normalizationService;
        this.kafkaProducerService = kafkaProducerService;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> moderate(@RequestBody ModerationRequestDTO request) {
        String trackingId = UUID.randomUUID().toString();
        String originalPayload = request.payload();
        String normalizedPayload = normalizationService.normalize(originalPayload);
        
        eventPublisher.publishEvent(new ModerationRequestReceivedEvent(trackingId, originalPayload, java.time.LocalDateTime.now()));
        
        kafkaProducerService.publishRequest(trackingId, normalizedPayload);

        return ResponseEntity.accepted().body(Map.of(
            "trackingId", trackingId,
            "status", "ACCEPTED"
        ));
    }
}
