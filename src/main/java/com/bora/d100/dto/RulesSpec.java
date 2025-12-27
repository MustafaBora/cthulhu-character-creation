package com.bora.d100.dto;

import java.util.List;
import java.util.Map;

/**
 * Spec-driven rules definition.
 * This JSON is served from the backend and loaded by both frontend and backend
 * to ensure consistent calculations without code duplication.
 */
public class RulesSpec {

    /**
     * Base characteristics and skills initial values (starting points).
     */
    private Map<String, Integer> base;

    /**
     * Usage costs - how many XP points are needed to increase a characteristic or skill by 1.
     * Example: "APP": 60 means it costs 60 XP to increase APP by 1 point.
     */
    private Map<String, Integer> usage;

    /**
     * Penalty thresholds and multipliers for difficulty scaling.
     */
    private PenaltyRules penaltyRules;

    public RulesSpec() {
    }

    public RulesSpec(Map<String, Integer> base, Map<String, Integer> usage, PenaltyRules penaltyRules) {
        this.base = base;
        this.usage = usage;
        this.penaltyRules = penaltyRules;
    }

    public Map<String, Integer> getBase() {
        return base;
    }

    public void setBase(Map<String, Integer> base) {
        this.base = base;
    }

    public Map<String, Integer> getUsage() {
        return usage;
    }

    public void setUsage(Map<String, Integer> usage) {
        this.usage = usage;
    }

    public PenaltyRules getPenaltyRules() {
        return penaltyRules;
    }

    public void setPenaltyRules(PenaltyRules penaltyRules) {
        this.penaltyRules = penaltyRules;
    }

    /**
     * Nested class for penalty threshold rules.
     * Supports multiple penalty levels with thresholds and multipliers.
     */
    public static class PenaltyRules {
        private List<Integer> thresholds;      // [40, 50, 60, 70, 80]
        private List<Integer> multipliers;     // [2, 3, 4, 5, 6]

        public PenaltyRules() {
        }

        public PenaltyRules(List<Integer> thresholds, List<Integer> multipliers) {
            this.thresholds = thresholds;
            this.multipliers = multipliers;
        }

        public List<Integer> getThresholds() {
            return thresholds;
        }

        public void setThresholds(List<Integer> thresholds) {
            this.thresholds = thresholds;
        }

        public List<Integer> getMultipliers() {
            return multipliers;
        }

        public void setMultipliers(List<Integer> multipliers) {
            this.multipliers = multipliers;
        }

        /**
         * Get the multiplier for a given value based on threshold levels.
         * Returns base multiplier of 1 if value is below first threshold.
         */
        public int getMultiplierForValue(int value) {
            if (thresholds == null || multipliers == null || thresholds.isEmpty()) {
                return 1;
            }

            for (int i = 0; i < thresholds.size(); i++) {
                if (value >= thresholds.get(i)) {
                    if (i == thresholds.size() - 1 || value < thresholds.get(i + 1)) {
                        return multipliers.get(i);
                    }
                }
            }
            return 1; // Default multiplier if below first threshold
        }
    }
}
