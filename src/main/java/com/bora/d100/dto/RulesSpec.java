package com.bora.d100.dto;

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
    
    public RulesSpec() {}
    
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
     */
    public static class PenaltyRules {
        private int firstThreshold;   // 50
        private int secondThreshold;  // 75
        private int firstPenaltyMult; // 2x
        private int secondPenaltyMult; // 3x
        
        public PenaltyRules() {}
        
        public PenaltyRules(int firstThreshold, int secondThreshold, int firstPenaltyMult, int secondPenaltyMult) {
            this.firstThreshold = firstThreshold;
            this.secondThreshold = secondThreshold;
            this.firstPenaltyMult = firstPenaltyMult;
            this.secondPenaltyMult = secondPenaltyMult;
        }

        public int getFirstThreshold() {
            return firstThreshold;
        }

        public void setFirstThreshold(int firstThreshold) {
            this.firstThreshold = firstThreshold;
        }

        public int getSecondThreshold() {
            return secondThreshold;
        }

        public void setSecondThreshold(int secondThreshold) {
            this.secondThreshold = secondThreshold;
        }

        public int getFirstPenaltyMult() {
            return firstPenaltyMult;
        }

        public void setFirstPenaltyMult(int firstPenaltyMult) {
            this.firstPenaltyMult = firstPenaltyMult;
        }

        public int getSecondPenaltyMult() {
            return secondPenaltyMult;
        }

        public void setSecondPenaltyMult(int secondPenaltyMult) {
            this.secondPenaltyMult = secondPenaltyMult;
        }
    }
}
