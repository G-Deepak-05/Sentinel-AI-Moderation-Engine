package com.sentinel.gateway.action.repository;

import com.sentinel.gateway.action.entity.ModerationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModerationRequestRepository extends JpaRepository<ModerationRequest, String> {
}
