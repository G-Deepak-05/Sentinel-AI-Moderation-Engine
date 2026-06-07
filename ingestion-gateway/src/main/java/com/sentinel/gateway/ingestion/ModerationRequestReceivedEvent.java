package com.sentinel.gateway.ingestion;

import java.time.LocalDateTime;

public record ModerationRequestReceivedEvent(String trackingId, String payload, LocalDateTime timestamp) {}
