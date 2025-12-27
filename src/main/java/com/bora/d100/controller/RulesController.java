package com.bora.d100.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bora.d100.dto.RulesSpec;
import com.bora.d100.service.RulesService;

/**
 * API endpoints for game rules specification.
 * Serves a single source of truth for all game rules (base values, usage costs, penalties).
 * Frontend loads this spec to drive calculations consistently without code duplication.
 */
@RestController
@RequestMapping("/api/rules")
public class RulesController {

    private final RulesService rulesService;

    public RulesController(RulesService rulesService) {
        this.rulesService = rulesService;
    }

    /**
     * GET /api/rules
     * Returns the complete rules specification.
     * Used by frontend to:
     * - Display base values for characteristics and skills
     * - Calculate XP costs using the same algorithm as backend
     * - Load penalty thresholds and multipliers
     */
    @GetMapping
    public ResponseEntity<RulesSpec> getRulesSpec() {
        return ResponseEntity.ok(rulesService.getRulesSpec());
    }
}
