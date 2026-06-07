package com.sentinel.gateway.action;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WebhookService {

    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);
    private final RestTemplate restTemplate;
    private final String webhookUrl;

    public WebhookService(@Value("${webhook.receiver.url}") String webhookUrl) {
        this.restTemplate = new RestTemplate();
        this.webhookUrl = webhookUrl;
    }

    public void triggerWebhook(String trackingId, String action) {
        try {
            var payload = java.util.Map.of("trackingId", trackingId, "action", action);
            restTemplate.postForEntity(webhookUrl, payload, String.class);
            logger.info("Webhook triggered for trackingId: {}, action: {}", trackingId, action);
        } catch (Exception e) {
            logger.error("Failed to trigger webhook for trackingId: {}", trackingId, e);
        }
    }
}
