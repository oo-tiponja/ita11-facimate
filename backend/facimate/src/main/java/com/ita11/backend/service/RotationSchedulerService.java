package com.ita11.backend.service;

import com.ita11.backend.model.*;
import com.ita11.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class RotationSchedulerService {

    private final CeremonyRepository ceremonyRepository;
    private final RotationStateRepository rotationStateRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final NotificationService notificationService;


    private static final ZoneId MANILA = ZoneId.of("Asia/Manila");

    @Scheduled(cron = "0 0 6 * * MON-FRI", zone = "Asia/Manila")
    public void rotateStandup() {
        log.info("Running Standup rotation check");
        ceremonyRepository.findAll().stream()
                .filter(c -> c.getCeremonyType() == CeremonyType.STANDUP)
                .forEach(this::rotateIfNewWeek);
    }

    @Scheduled(cron = "0 0 6 * * MON", zone = "Asia/Manila")
    public void rotateIPM() {
        log.info("Running IPM rotation check");
        if (!isSprintStartMonday()) return;

        ceremonyRepository.findAll().stream()
                .filter(c -> c.getCeremonyType() == CeremonyType.IPM)
                .forEach(this::advanceRotation);
    }

    @Scheduled(cron = "0 0 6 * * FRI", zone = "Asia/Manila")
    public void rotateRetrospective() {
        log.info("Running Retrospective rotation check");
        if (!isSprintEndFriday()) return;

        ceremonyRepository.findAll().stream()
                .filter(c -> c.getCeremonyType() == CeremonyType.RETROSPECTIVE)
                .forEach(this::advanceRotation);
    }

    private void rotateIfNewWeek(Ceremony ceremony) {
        RotationState state = rotationStateRepository
                .findByCeremonyId(ceremony.getId())
                .orElse(null);

        if (state == null) return;

        LocalDate today = LocalDate.now(MANILA);
        LocalDate lastRotated = state.getLastRotated() != null
                ? state.getLastRotated().toLocalDate()
                : null;
        
        if (lastRotated == null || !isSameWeek(lastRotated, today)) {
            advanceRotation(ceremony);
        }
    }

    private void advanceRotation(Ceremony ceremony) {
        RotationState state = rotationStateRepository
                .findByCeremonyId(ceremony.getId())
                .orElse(null);

        if (state == null) {
            log.warn("No rotation state found for ceremony: {}", ceremony.getName());
            return;
        }

        List<TeamMember> activeMembers = teamMemberRepository
                .findByIsActiveTrueOrderBySortOrder();

        if (activeMembers.isEmpty()) {
            log.warn("No active members for rotation");
            return;
        }

        int currentIndex = findMemberIndex(activeMembers, state.getCurrentMemberId());
        int nextIndex = (currentIndex + 1) % activeMembers.size();
        TeamMember newFacilitator = activeMembers.get(nextIndex);

        state.setCurrentMemberId(newFacilitator.getId());
        state.setLastUpdated(LocalDateTime.now());
        state.setLastRotated(LocalDateTime.now(MANILA));
        rotationStateRepository.save(state);

        log.info("Rotated {} to: {}", ceremony.getName(), newFacilitator.getName());

        notificationService.sendTeamsNotification(ceremony, newFacilitator, "Rotation");
    }

    private boolean isSprintStartMonday() {
        LocalDate today = LocalDate.now(MANILA);
        LocalDate anchor = LocalDate.of(2026, 2, 2);
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(anchor, today);
        return daysBetween >= 0 && daysBetween % 14 == 0;
    }

    private boolean isSprintEndFriday() {
        LocalDate today = LocalDate.now(MANILA);
        LocalDate anchor = LocalDate.of(2026, 2, 13);
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(anchor, today);
        return daysBetween >= 0 && daysBetween % 14 == 0;
    }

    private boolean isSameWeek(LocalDate a, LocalDate b) {
        LocalDate startOfWeekA = a.with(DayOfWeek.MONDAY);
        LocalDate startOfWeekB = b.with(DayOfWeek.MONDAY);
        return startOfWeekA.equals(startOfWeekB);
    }

    private int findMemberIndex(List<TeamMember> members, Long memberId) {
        return IntStream.range(0, members.size())
                .filter(member -> Objects.equals(members.get(member).getId(), memberId))
                .findFirst()
                .orElse(-1);
    }
}