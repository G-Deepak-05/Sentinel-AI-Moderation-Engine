package com.sentinel.gateway.action.repository;

import com.sentinel.gateway.action.entity.ModerationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModerationResultRepository extends JpaRepository<ModerationResult, String> {
}
