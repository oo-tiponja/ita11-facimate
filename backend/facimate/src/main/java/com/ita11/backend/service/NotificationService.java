package com.ita11.backend.service;

import java.net.URI;
import com.ita11.backend.model.Ceremony;
import com.ita11.backend.model.TeamMember;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.scheduling.annotation.Async;


import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    public static final String HTTP_LOCALHOST_5173 = "{${frontend.url}}";

    @Value("${teams.webhook.url}")
    private String teamsWebhookUrl;

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendTeamsNotification(Ceremony ceremony, TeamMember facilitator, String action) {
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
        }
    }
}