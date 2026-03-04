package com.ita11.backend.repository;

import com.ita11.backend.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByIsActiveTrueOrderBySortOrder();
}