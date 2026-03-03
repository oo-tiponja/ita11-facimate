package com.ita11.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationLogDto {
    private Long id;
    private String memberName;
    private String message;
    private LocalDateTime sentAt;
}