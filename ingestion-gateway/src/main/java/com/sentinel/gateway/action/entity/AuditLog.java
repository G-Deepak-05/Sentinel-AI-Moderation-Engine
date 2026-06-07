package com.sentinel.gateway.action.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "result_id", nullable = false)
    private String resultId;

    @Column(name = "moderator_id", nullable = false)
    private String moderatorId;

    @Column(name = "action_taken", nullable = false)
    private String actionTaken;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public AuditLog() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getResultId() { return resultId; }
    public void setResultId(String resultId) { this.resultId = resultId; }
    public String getModeratorId() { return moderatorId; }
    public void setModeratorId(String moderatorId) { this.moderatorId = moderatorId; }
    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
