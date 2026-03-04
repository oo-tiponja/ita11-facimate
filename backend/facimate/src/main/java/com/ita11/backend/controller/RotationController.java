package com.ita11.backend.controller;

import com.ita11.backend.dto.*;
import com.ita11.backend.service.RotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rotation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RotationController {

    private final RotationService rotationService;

    @GetMapping("/dashboard")
    public List<DashboardDto> getDashboard() {
        return rotationService.getDashboard();
    }

    @PostMapping("/skip/{ceremonyId}")
    public void skipToNext(@PathVariable Long ceremonyId) {
        rotationService.skipToNext(ceremonyId);
    }

    @PostMapping("/assign")
    public void assignFacilitator(@RequestBody AssignRequestDto request) {
        rotationService.assignFacilitator(request.getCeremonyId(), request.getMemberId());
    }
}