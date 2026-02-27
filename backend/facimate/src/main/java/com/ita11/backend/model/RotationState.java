package com.ita11.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RotationState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ceremonyId;
    private Long currentMemberId;
    private LocalDateTime lastUpdated;
    private LocalDateTime lastRotated;
}