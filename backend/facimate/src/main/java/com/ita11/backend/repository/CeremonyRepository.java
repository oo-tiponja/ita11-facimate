package com.ita11.backend.repository;

import com.ita11.backend.model.Ceremony;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CeremonyRepository extends JpaRepository<Ceremony, Long> {
}
