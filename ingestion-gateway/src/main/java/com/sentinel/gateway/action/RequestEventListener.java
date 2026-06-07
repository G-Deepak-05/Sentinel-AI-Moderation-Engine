package com.sentinel.gateway.action;

import com.sentinel.gateway.action.entity.ModerationRequest;
import com.sentinel.gateway.action.repository.ModerationRequestRepository;
import com.sentinel.gateway.ingestion.ModerationRequestReceivedEvent;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Service;

@Service
public class RequestEventListener {

    private final ModerationRequestRepository repository;

    public RequestEventListener(ModerationRequestRepository repository) {
        this.repository = repository;
    }

    @org.springframework.context.event.EventListener
    void on(ModerationRequestReceivedEvent event) {
        ModerationRequest request = new ModerationRequest(event.trackingId(), event.payload(), event.timestamp());
        repository.save(request);
    }
}
