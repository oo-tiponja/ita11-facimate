package com.ita11.backend.service;

import com.ita11.backend.dto.DashboardDto;
import com.ita11.backend.exception.ResourceNotFoundException;
import com.ita11.backend.model.Ceremony;
import com.ita11.backend.model.RotationState;
import com.ita11.backend.model.TeamMember;
import com.ita11.backend.repository.CeremonyRepository;
import com.ita11.backend.repository.RotationStateRepository;
import com.ita11.backend.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class RotationService {

    private final TeamMemberRepository teamMemberRepository;
    private final CeremonyRepository ceremonyRepository;
    private final RotationStateRepository rotationStateRepository;
    private final NotificationService notificationService;

    public List<DashboardDto> getDashboard() {
        List<Ceremony> ceremonies = ceremonyRepository.findAll();
        return ceremonies.stream()
                .map(this::buildDashboardDto)
                .collect(Collectors.toList());
    }

    private DashboardDto buildDashboardDto(Ceremony ceremony) {
        RotationState state = rotationStateRepository.findByCeremonyId(ceremony.getId()).orElse(null);
        List<TeamMember> activeMembers = teamMemberRepository.findByIsActiveTrueOrderBySortOrder();

        if (state == null || activeMembers.isEmpty()) {
            return createEmptyDashboard(ceremony);
        }

        TeamMember currentMember = teamMemberRepository
                .findById(state.getCurrentMemberId())
                .orElse(null);

        String currentName = currentMember != null ? currentMember.getName() : "Unknown";
        String currentEmail = currentMember != null ? currentMember.getEmail() : null;

        int currentIndex = findMemberIndex(activeMembers, state.getCurrentMemberId());
        String previous = getPreviousMember(activeMembers, currentIndex);
        String next = getNextMember(activeMembers, currentIndex);

        return new DashboardDto(
                ceremony.getId(),
                ceremony.getName(),
                ceremony.getSchedule(),
                currentName,
                currentEmail,
                previous,
                next
        );
    }

    private DashboardDto createEmptyDashboard(Ceremony ceremony) {
        return new DashboardDto(
                ceremony.getId(),
                ceremony.getName(),
                ceremony.getSchedule(),
                "Not set",
                null,
                "N/A",
                "N/A"
        );
    }

    private String getCurrentMemberName(Long memberId) {
        return teamMemberRepository.findById(memberId)
                .map(TeamMember::getName)
                .orElse("Unknown");
    }

    private int findMemberIndex(List<TeamMember> members, Long memberId) {
        return IntStream.range(0, members.size())
                .filter(index -> members.get(index).getId().equals(memberId))
                .findFirst()
                .orElse(-1);
    }

    private String getPreviousMember(List<TeamMember> members, int currentIndex) {
        int prevIndex = currentIndex > 0 ? currentIndex - 1 : members.size() - 1;
        return members.get(prevIndex).getName();
    }

    private String getNextMember(List<TeamMember> members, int currentIndex) {
        int nextIndex = (currentIndex + 1) % members.size();
        return members.get(nextIndex).getName();
    }

    public void skipToNext(Long ceremonyId) {
        RotationState state = rotationStateRepository.findByCeremonyId(ceremonyId)
                .orElseThrow(() -> new RuntimeException("Rotation state not found"));

        List<TeamMember> activeMembers = teamMemberRepository.findByIsActiveTrueOrderBySortOrder();

        int currentIndex = findMemberIndex(activeMembers, state.getCurrentMemberId());
        int nextIndex = (currentIndex + 1) % activeMembers.size();
        TeamMember newFacilitator = activeMembers.get(nextIndex);

        state.setCurrentMemberId(newFacilitator.getId());
        state.setLastUpdated(LocalDateTime.now());
        rotationStateRepository.save(state);

        ceremonyRepository.findById(ceremonyId).ifPresent(ceremony -> {
            notificationService.sendTeamsNotification(ceremony, newFacilitator, "Skipped");
            notificationService.sendEmailNotification(ceremony, newFacilitator);
        });
    }

    public void assignFacilitator(Long ceremonyId, Long memberId) {
        findMemberId(memberId);

        RotationState state = rotationStateRepository.findByCeremonyId(ceremonyId)
                .orElseGet(() -> createNewRotationState(ceremonyId, memberId));

        state.setCurrentMemberId(memberId);
        state.setLastUpdated(LocalDateTime.now());
        rotationStateRepository.save(state);

        Ceremony ceremony = ceremonyRepository.findById(ceremonyId).orElse(null);
        TeamMember facilitator = teamMemberRepository.findById(memberId).orElse(null);
        if (ceremony != null && facilitator != null) {
            notificationService.sendTeamsNotification(ceremony, facilitator, "Assigned");
            notificationService.sendEmailNotification(ceremony, facilitator);
        }
    }

    public void autoSkipToNextActive(RotationState state, List<TeamMember> activeMembers) {
        if (activeMembers.isEmpty()) {
            return;
        }

        int nextIndex = 0;
        IntStream.range(0, activeMembers.size())
                .filter(index -> activeMembers.get(index).getId().equals(state.getCurrentMemberId()))
                .findFirst()
                .orElse(0);

        state.setCurrentMemberId(activeMembers.get(nextIndex).getId());
        state.setLastUpdated(LocalDateTime.now());
        rotationStateRepository.save(state);
    }

    private void findMemberId(Long memberId) {
        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member ID: " + memberId + " - Not Found."));

        if (!member.getIsActive()) {
            throw new IllegalArgumentException("Cannot assign inactive member");
        }
    }

    private RotationState createNewRotationState(Long ceremonyId, Long memberId) {
        return new RotationState(null, ceremonyId, memberId, LocalDateTime.now(), null);
    }
}