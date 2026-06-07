package com.sentinel.gateway.action;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinel.gateway.action.entity.ModerationResult;
import com.sentinel.gateway.action.repository.ModerationResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class ActionKafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(ActionKafkaConsumerService.class);
    private final ObjectMapper objectMapper;
    private final ModerationResultRepository resultRepository;
    private final WebhookService webhookService;

    public ActionKafkaConsumerService(ObjectMapper objectMapper, 
                                      ModerationResultRepository resultRepository,
                                      WebhookService webhookService) {
        this.objectMapper = objectMapper;
        this.resultRepository = resultRepository;
        this.webhookService = webhookService;
    }

    @KafkaListener(topics = "moderation-results", groupId = "sentinel-action-group")
    public void consumeResult(String message) {
        try {
            Map<String, Object> payload = objectMapper.readValue(message, new TypeReference<>() {});
            String trackingId = (String) payload.get("trackingId");
            String action = (String) payload.get("action");
            
            ModerationResult result = new ModerationResult();
            result.setId(UUID.randomUUID().toString());
            result.setRequestId(trackingId);
            result.setAction(action);
            
            if (payload.containsKey("toxicityScore")) {
                result.setToxicityScore(Double.valueOf(payload.get("toxicityScore").toString()));
            }
            if (payload.containsKey("severeInsultScore")) {
                result.setSevereInsultScore(Double.valueOf(payload.get("severeInsultScore").toString()));
            }
            if (payload.containsKey("harassmentScore")) {
                result.setHarassmentScore(Double.valueOf(payload.get("harassmentScore").toString()));
            }
            if (payload.containsKey("threatScore")) {
                result.setThreatScore(Double.valueOf(payload.get("threatScore").toString()));
            }
            if (payload.containsKey("explainingTokens")) {
                result.setExplainingTokens((String) payload.get("explainingTokens"));
            }
            
            result.setCreatedAt(LocalDateTime.now());
            
            resultRepository.save(result);
            logger.info("Saved moderation result for trackingId: {}", trackingId);
            
            if (!"FLAG".equals(action)) {
                webhookService.triggerWebhook(trackingId, action);
            }

        } catch (Exception e) {
            logger.error("Error processing moderation result", e);
        }
    }
}
