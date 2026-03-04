package com.ita11.backend.service;

import com.ita11.backend.model.*;
import com.ita11.backend.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    @Value("${teams.webhook.url}")
    private String teamsWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final NotificationLogRepository notificationLogRepository;

    public void sendTeamsNotification(Ceremony ceremony, TeamMember facilitator, String action) {
        String message = buildNotificationMessage(ceremony, facilitator, action);
        Status status = Status.SENT;

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("ceremonyName", ceremony.getName());
            payload.put("facilitatorName", facilitator.getName());
            payload.put("facilitatorEmail", facilitator.getEmail().trim());
            payload.put("schedule", ceremony.getSchedule());
            payload.put("action", action);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(URI.create(teamsWebhookUrl), request, String.class);
            log.info("Teams notification sent for ceremony {} with action {}", ceremony.getName(), action);
        } catch (Exception e) {
            log.error("Failed to send Teams notification for ceremony {}: {}", ceremony.getName(), e.getMessage());
            status = Status.FAILED;
        } finally {
            // Save notification log to database
            saveNotificationLog(ceremony, facilitator, message, status);
        }
    }

    private String buildNotificationMessage(Ceremony ceremony, TeamMember facilitator, String action) {
        return String.format(
                "Action applied: %s\nNew facilitator for: %s — (%s)",
                action,
                ceremony.getName(),
                ceremony.getSchedule()
        );
    }

    private void saveNotificationLog(Ceremony ceremony, TeamMember facilitator, String message, Status status) {
        try {
            NotificationLog notificationLog = new NotificationLog(
                    null,
                    ceremony,
                    facilitator,
                    Channel.TEAMS,
                    LocalDateTime.now(),
                    status,
                    message
            );
            notificationLogRepository.save(notificationLog);
            log.info("Notification log saved for ceremony {} and member {}", ceremony.getName(), facilitator.getName());
        } catch (Exception e) {
            log.error("Failed to save notification log: {}", e.getMessage());
        }
    }
}