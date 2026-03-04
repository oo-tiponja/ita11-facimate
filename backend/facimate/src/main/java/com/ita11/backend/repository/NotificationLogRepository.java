package com.ita11.backend.repository;

import com.ita11.backend.model.CeremonyType;
import com.ita11.backend.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    List<NotificationLog> findTop3ByCeremony_CeremonyTypeInOrderBySentAtDesc(List<CeremonyType> ceremonyTypes);
}