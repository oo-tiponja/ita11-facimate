package com.ita11.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class DashboardDto {

    private Long ceremonyId;
    private String ceremonyName;
    private String ceremonySchedule;

    private String currentFacilitator;
    private String currentFacilitatorEmail;

    private String previousFacilitator;
    private String nextFacilitator;
}
