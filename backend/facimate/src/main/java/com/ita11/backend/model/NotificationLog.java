package com.ita11.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ceremony_id")
    private Ceremony ceremony;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private TeamMember member;

    @Enumerated(EnumType.STRING)
    private Channel channel;

    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String message;
}
