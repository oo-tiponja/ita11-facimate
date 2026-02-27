package com.ita11.backend.controller;

import com.ita11.backend.model.Ceremony;
import com.ita11.backend.repository.CeremonyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ceremonies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CeremonyController {

    private final CeremonyRepository ceremonyRepository;

    @GetMapping
    public List<Ceremony> getAllCeremonies() {
        return ceremonyRepository.findAll();
    }

    @PostMapping
    public Ceremony addCeremony(@RequestBody Ceremony ceremony) {
        return ceremonyRepository.save(ceremony);
    }
}
