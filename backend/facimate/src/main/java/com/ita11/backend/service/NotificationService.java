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
            payload.put("facilitatorEmail", facilitator.getEmail());
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

    @Async
    public void sendEmailNotification(Ceremony ceremony, TeamMember facilitator) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            emailNotificationBodyHelper(ceremony, facilitator, helper);

            mailSender.send(message);
            log.info("Email notification sent to {}", facilitator.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email notification to {}: {}", facilitator.getEmail(), e.getMessage());
        }
    }

    private static void emailNotificationBodyHelper(Ceremony ceremony, TeamMember facilitator, MimeMessageHelper helper) throws MessagingException {
        helper.setTo(facilitator.getEmail());
        helper.setSubject("You're facilitating " + ceremony.getName() + " — " + ceremony.getSchedule());
        helper.setText(String.format("""
            <html><body>
            <p>Hi <strong>%s</strong>,</p>
            <p>You've been assigned as facilitator for:</p>
            <ul>
                <li><strong>Ceremony:</strong> %s</li>
                <li><strong>Type:</strong> %s</li>
                <li><strong>Schedule:</strong> %s</li>
            </ul>
            <p>If unavailable, update your status in the app.</p>
            <a href="%s">Open Facimate App</a>
            </body></html>
            """,
                facilitator.getName(),
                ceremony.getName(),
                ceremony.getCeremonyType().toString(),
                ceremony.getSchedule(),
                HTTP_LOCALHOST_5173
        ), true);
    }
}