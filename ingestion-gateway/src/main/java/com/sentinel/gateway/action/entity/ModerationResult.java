package com.sentinel.gateway.action.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "moderation_results")
public class ModerationResult {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "request_id", nullable = false)
    private String requestId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "toxicity_score")
    private Double toxicityScore;

    @Column(name = "severe_insult_score")
    private Double severeInsultScore;

    @Column(name = "harassment_score")
    private Double harassmentScore;

    @Column(name = "threat_score")
    private Double threatScore;

    @Column(name = "explaining_tokens")
    private String explainingTokens;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ModerationResult() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Double getToxicityScore() { return toxicityScore; }
    public void setToxicityScore(Double toxicityScore) { this.toxicityScore = toxicityScore; }
    public Double getSevereInsultScore() { return severeInsultScore; }
    public void setSevereInsultScore(Double severeInsultScore) { this.severeInsultScore = severeInsultScore; }
    public Double getHarassmentScore() { return harassmentScore; }
    public void setHarassmentScore(Double harassmentScore) { this.harassmentScore = harassmentScore; }
    public Double getThreatScore() { return threatScore; }
    public void setThreatScore(Double threatScore) { this.threatScore = threatScore; }
    public String getExplainingTokens() { return explainingTokens; }
    public void setExplainingTokens(String explainingTokens) { this.explainingTokens = explainingTokens; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
