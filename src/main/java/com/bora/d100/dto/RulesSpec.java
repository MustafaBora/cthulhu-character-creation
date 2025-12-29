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
     * Cost per point - how many XP points are needed to increase a characteristic or skill by 1.
     * Example: "APP": 60 means it costs 60 XP to increase APP by 1 point.
     */
    private Map<String, Integer> cost;

    /**
     * Penalty thresholds and multipliers for difficulty scaling.
     */
    private PenaltyRules penaltyRules;

    /**
     * Level calculation rules.
     */
    private LevelRules levelRules;

    public RulesSpec() {
    }

    public RulesSpec(Map<String, Integer> base, Map<String, Integer> cost, PenaltyRules penaltyRules, LevelRules levelRules) {
        this.base = base;
        this.cost = cost;
        this.penaltyRules = penaltyRules;
        this.levelRules = levelRules;
    }

    public Map<String, Integer> getBase() {
        return base;
    }

    public void setBase(Map<String, Integer> base) {
        this.base = base;
    }

    public Map<String, Integer> getCost() {
        return cost;
    }

    public void setCost(Map<String, Integer> cost) {
        this.cost = cost;
    }

    public PenaltyRules getPenaltyRules() {
        return penaltyRules;
    }

    public void setPenaltyRules(PenaltyRules penaltyRules) {
        this.penaltyRules = penaltyRules;
    }

    public LevelRules getLevelRules() {
        return levelRules;
    }

    public void setLevelRules(LevelRules levelRules) {
        this.levelRules = levelRules;
    }

    /**
     * Nested class for penalty threshold rules.
     * Supports multiple penalty levels with thresholds and multipliers.
     */
    public static class PenaltyRules {
        private List<Integer> thresholds;      // [40, 50, 60, 70, 80]
        private List<Double> multipliers;      // [1.5, 2.0, 3.0, 4.0, 5.0]

        public PenaltyRules() {
        }

        public PenaltyRules(List<Integer> thresholds, List<Double> multipliers) {
            this.thresholds = thresholds;
            this.multipliers = multipliers;
        }

        public List<Integer> getThresholds() {
            return thresholds;
        }

        public void setThresholds(List<Integer> thresholds) {
            this.thresholds = thresholds;
        }

        public List<Double> getMultipliers() {
            return multipliers;
        }

        public void setMultipliers(List<Double> multipliers) {
            this.multipliers = multipliers;
        }

        /**
         * Get the multiplier for a given value based on threshold levels.
         * Returns base multiplier of 1.0 if value is below first threshold.
         */
        public double getMultiplierForValue(int value) {
            if (thresholds == null || multipliers == null || thresholds.isEmpty()) {
                return 1.0;
            }

            for (int i = 0; i < thresholds.size(); i++) {
                if (value >= thresholds.get(i)) {
                    if (i == thresholds.size() - 1 || value < thresholds.get(i + 1)) {
                        return multipliers.get(i);
                    }
                }
            }
            return 1.0; // Default multiplier if below first threshold
        }
    }

    /**
     * Nested class for level calculation rules.
     * Level = (UsedXP - baseXP) / xpPerLevel
     * Example: Level = (UsedXP - 100000) / 10000
     */
    public static class LevelRules {
        private int baseXP;        // Starting XP threshold (e.g., 100000)
        private int xpPerLevel;    // XP needed per level (e.g., 10000)

        public LevelRules() {
        }

        public LevelRules(int baseXP, int xpPerLevel) {
            this.baseXP = baseXP;
            this.xpPerLevel = xpPerLevel;
        }

        public int getBaseXP() {
            return baseXP;
        }

        public void setBaseXP(int baseXP) {
            this.baseXP = baseXP;
        }

        public int getXpPerLevel() {
            return xpPerLevel;
        }

        public void setXpPerLevel(int xpPerLevel) {
            this.xpPerLevel = xpPerLevel;
        }

        /**
         * Calculate the level based on used XP.
         * Level = (usedXP - baseXP) / xpPerLevel
         * Minimum level is always 1.
         * Example: 100000 XP = lvl 1, 105000 XP = lvl 1, 115000 XP = lvl 1, 125000 XP = lvl 2
         */
        public int calculateLevel(int usedXP) {
            int level = (usedXP - baseXP) / xpPerLevel;
            return Math.max(1, level);
        }
    }
}
