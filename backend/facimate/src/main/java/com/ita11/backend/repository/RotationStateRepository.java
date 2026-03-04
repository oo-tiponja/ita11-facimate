package com.ita11.backend.repository;

import com.ita11.backend.model.RotationState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RotationStateRepository extends JpaRepository<RotationState, Long> {
    Optional<RotationState> findByCeremonyId(Long ceremonyId);
}