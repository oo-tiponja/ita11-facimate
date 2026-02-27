package com.ita11.backend.controller;

import com.ita11.backend.exception.ResourceNotFoundException;
import com.ita11.backend.model.TeamMember;
import com.ita11.backend.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamMemberController {

    private final TeamMemberRepository teamMemberRepository;

    @GetMapping
    public List<TeamMember> getAllMembers() {
        return teamMemberRepository.findAll();
    }

    @PostMapping
    public TeamMember addMember(@RequestBody TeamMember member) {
        return teamMemberRepository.save(member);
    }

    @PutMapping("/{id}/toggle-active")
    public TeamMember toggleMemberActive(@PathVariable Long id){
        TeamMember member = teamMemberRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Member ID: " + id + " - Not Found."));

        member.setIsActive(!member.getIsActive());
        return teamMemberRepository.save(member);
    }
}
