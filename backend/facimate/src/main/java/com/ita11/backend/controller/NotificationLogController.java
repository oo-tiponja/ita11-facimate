package com.ita11.backend.controller;

import com.ita11.backend.dto.NotificationLogDto;
import com.ita11.backend.model.CeremonyType;
import com.ita11.backend.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationLogController {

    private final NotificationLogRepository notificationLogRepository;

    @GetMapping("/recent")
    public List<NotificationLogDto> getRecentNotifications() {
        // Get all current ceremony types
        List<CeremonyType> currentCeremonyTypes = Arrays.asList(CeremonyType.values());

        return notificationLogRepository.findTop3ByCeremony_CeremonyTypeInOrderBySentAtDesc(currentCeremonyTypes)
                .stream()
                .map(log -> new NotificationLogDto(
                        log.getId(),
                        log.getMember().getName(),
                        log.getMessage(),
                        log.getSentAt()
                ))
                .toList();
    }
}
