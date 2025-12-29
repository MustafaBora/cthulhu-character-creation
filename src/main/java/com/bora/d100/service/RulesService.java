package com.bora.d100.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.bora.d100.dto.RulesSpec;

/**
 * Service to manage and serve the rules specification.
 * This is a single source of truth for all game rules.
 */
@Service
public class RulesService {
    
    private final RulesSpec rulesSpec;
    
    public RulesService() {
        this.rulesSpec = initializeRulesSpec();
    }
    
    /**
     * Initialize the complete rules specification with all characteristics and skills.
     */
    private RulesSpec initializeRulesSpec() {
        Map<String, Integer> base = Map.<String, Integer>ofEntries(
                Map.entry("totalXP", 200000),
                Map.entry("usedXP", 0),
                Map.entry("remainingXP", 0),

                Map.entry("APP", 30),
                Map.entry("BONUS", 0),
                Map.entry("BRV", 45),
                Map.entry("STA", 30),
                Map.entry("AGI", 35),
                Map.entry("EDU", 20),
                Map.entry("INT", 30),
                Map.entry("LUCK", 35),
                Map.entry("SENSE", 10),
                Map.entry("WILL", 30),
                Map.entry("STATUS", 1),
                Map.entry("SAN", 45),
                Map.entry("SIZ", 31),
                Map.entry("STR", 25),
                Map.entry("ARMOR", 0),
                Map.entry("RES", 0),

                Map.entry("Accounting", 7),
                Map.entry("Anthropology", 6),
                Map.entry("Appraise", 8),
                Map.entry("Archeology", 3),
                Map.entry("Art Craft", 15),
                Map.entry("Art Craft 2", 14),
                Map.entry("Charm", 20),
                Map.entry("Climb", 20),
                Map.entry("Credit Rating", 5),
                Map.entry("Cthulhu Mythos", 0),
                Map.entry("Disguise", 5),
                Map.entry("Dodge", 20),
                Map.entry("Drive Auto", 10),
                Map.entry("Electrical Repair", 15),
                Map.entry("Fast Talk", 14),
                Map.entry("Fighting Brawl", 30),
                Map.entry("Fighting Other", 30),
                Map.entry("Firearms Handgun", 30),
                Map.entry("Firearms Other", 30),
                Map.entry("Firearms Rifle Shotgun", 30),
                Map.entry("First Aid", 20),
                Map.entry("History", 10),
                Map.entry("Intimidate", 15),
                Map.entry("Jump", 20),
                Map.entry("Language Other 1", 20),
                Map.entry("Language Other 2", 0),
                Map.entry("Language Other 3", 0),
                Map.entry("Language Own", 50),
                Map.entry("Law", 5),
                Map.entry("Library Use", 20),
                Map.entry("Listen", 30),
                Map.entry("Locksmith", 10),
                Map.entry("Mechanical Repair", 15),
                Map.entry("Medicine", 4),
                Map.entry("Natural World", 15),
                Map.entry("Navigate", 15),
                Map.entry("Occult", 4),
                Map.entry("Persuade", 15),
                Map.entry("Pilot", 1),
                Map.entry("Psychoanalysis", 2),
                Map.entry("Psychology", 10),
                Map.entry("Ride", 10),
                Map.entry("Science", 10),
                Map.entry("Science Other", 21),
                Map.entry("Science Other 2", 20),
                Map.entry("Sleight Of Hand", 10),
                Map.entry("SPOT", 15),
                Map.entry("Stealth", 20),
                Map.entry("Survival", 11),
                Map.entry("Swim", 22),
                Map.entry("Throw", 20),
                Map.entry("Track", 10),
                Map.entry("Other1", 0),
                Map.entry("Other2", 0),
                Map.entry("Other3", 0)
        );
        
        Map<String, Integer> cost = Map.<String, Integer>ofEntries(
                Map.entry("totalXP", 0),
                Map.entry("usedXP", 0),
                Map.entry("remainingXP", 0),

                // Characteristics
                Map.entry("APP", 60),
                Map.entry("BONUS", 150),
                Map.entry("BRV", 110),
                Map.entry("STA", 140),
                Map.entry("AGI", 180),
                Map.entry("EDU", 50),
                Map.entry("INT", 65),
                Map.entry("LUCK", 180),
                Map.entry("SENSE", 300),
                Map.entry("SPOT", 250),
                Map.entry("WILL", 200),
                Map.entry("STATUS", 200),
                Map.entry("SAN", 160),
                Map.entry("SIZ", 120),
                Map.entry("STR", 120),
                Map.entry("ARMOR", 15000),
                Map.entry("RES", 15000),

                // Skills
                Map.entry("Accounting", 20),
                Map.entry("Anthropology", 20),
                Map.entry("Appraise", 30),
                Map.entry("Archeology", 20),
                Map.entry("Art Craft", 40),
                Map.entry("Art Craft 2", 40),
                Map.entry("Charm", 120),
                Map.entry("Climb", 70),
                Map.entry("Credit Rating", 130),
                Map.entry("Cthulhu Mythos", 2),
                Map.entry("Disguise", 50),
                Map.entry("Dodge", 160),
                Map.entry("Drive Auto", 90),
                Map.entry("Electrical Repair", 50),
                Map.entry("Fast Talk", 120),
                Map.entry("Fighting Brawl", 120),
                Map.entry("Fighting Other", 120),
                Map.entry("Firearms Handgun", 160),
                Map.entry("Firearms Other", 140),
                Map.entry("Firearms Rifle Shotgun", 140),
                Map.entry("First Aid", 90),
                Map.entry("History", 60),
                Map.entry("Intimidate", 110),
                Map.entry("Jump", 100),
                Map.entry("Language Other 1", 20),
                Map.entry("Language Other 2", 20),
                Map.entry("Language Other 3", 20),
                Map.entry("Language Own", 20),
                Map.entry("Law", 70),
                Map.entry("Library Use", 160),
                Map.entry("Listen", 160),
                Map.entry("Locksmith", 110),
                Map.entry("Mechanical Repair", 50),
                Map.entry("Medicine", 50),
                Map.entry("Natural World", 80),
                Map.entry("Navigate", 40),
                Map.entry("Occult", 140),
                Map.entry("Persuade", 180),
                Map.entry("Pilot", 20),
                Map.entry("Psychoanalysis", 30),
                Map.entry("Psychology", 170),
                Map.entry("Ride", 90),
                Map.entry("Science", 50),
                Map.entry("Science Other", 50),
                Map.entry("Science Other 2", 50),
                Map.entry("Sleight Of Hand", 120),
                Map.entry("Stealth", 120),
                Map.entry("Survival", 30),
                Map.entry("Swim", 30),
                Map.entry("Throw", 100),
                Map.entry("Track", 40),
                Map.entry("Other1", 50),
                Map.entry("Other2", 100),
                Map.entry("Other3", 150)
        );
        
        // Multi-level penalty system: 5 threshold levels
        // Thresholds: 40, 50, 60, 70, 80
        // Multipliers: 1.5x, 2x, 3x, 4x, 6x
        List<Integer> penaltyThresholds = Arrays.asList(40, 50, 60, 70, 80);
        List<Double> penaltyMultipliers = Arrays.asList(1.5, 2.0, 3.0, 4.0, 5.0);
        RulesSpec.PenaltyRules penalties = new RulesSpec.PenaltyRules(penaltyThresholds, penaltyMultipliers);
        
        // Level system configuration
        // Level = (UsedXP - 100000) / 10000
        RulesSpec.LevelRules levelRules = new RulesSpec.LevelRules(100000, 10000);
        
        return new RulesSpec(base, cost, penalties, levelRules);
    }
    
    /**
     * Get the complete rules specification.
     * This is used by the frontend to perform client-side calculations consistently.
     */
    public RulesSpec getRulesSpec() {
        return rulesSpec;
    }
    
    /**
     * Get base value for a specific characteristic or skill.
     */
    public int getBaseValue(String key) {
        return rulesSpec.getBase().getOrDefault(key, 0);
    }
    
    /**
     * Get cost per point for a specific characteristic or skill.
     * Cost = how many XP points are needed to increase by 1.
     */
    public int getCost(String key) {
        return rulesSpec.getCost().getOrDefault(key, 0);
    }
    
    /**
     * Get the penalty rules configuration.
     */
    public RulesSpec.PenaltyRules getPenaltyRules() {
        return rulesSpec.getPenaltyRules();
    }
    
    /**
     * Get the level rules configuration.
     */
    public RulesSpec.LevelRules getLevelRules() {
        return rulesSpec.getLevelRules();
    }
}
