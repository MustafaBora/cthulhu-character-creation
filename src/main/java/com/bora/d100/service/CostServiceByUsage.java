package com.bora.d100.service;

import org.springframework.stereotype.Service;

import com.bora.d100.dto.RulesSpec;
import com.bora.d100.exception.XPCalculationMismatchException;
import com.bora.d100.model.Player;

/**
 * Cost calculation service based on cost rules.
 * Uses RulesService to load all calculation parameters from a single source of truth.
 * COST: 1 yükseltme için kaç puan harcaması gerektiğini gösterir.
 * Örneğin: APP = 60 demek, APP'yi 1 yükseltmek için 60 puan harcamanız gerekir.
 */
@Service
public class CostServiceByUsage {

    private final RulesService rulesService;

    public CostServiceByUsage(RulesService rulesService) {
        this.rulesService = rulesService;
    }

    /**
     * Belirli bir seviyeye ulaşmak için gereken toplam puanı hesaplar.
     * 
     * currentValue'dan targetValue'ye gitmek için kaç puan harcaması gerekir.
     * Penalti sistemi multi-level threshold tabanlıdır: 40, 50, 60, 70, 80 seviyeleri 1.5x, 2x, 3x, 4x, 6x çarpan alır.
     */
    public int getCostBetween(String skill, int currentValue, int targetValue) {
        int costPerPoint = rulesService.getCost(skill);
        RulesSpec.PenaltyRules penalties = rulesService.getPenaltyRules();

        // Hiç iyileştirme yoksa maliyet sıfır
        if (targetValue <= currentValue || costPerPoint == 0) {
            return 0;
        }

        double totalCost = 0;
        int current = currentValue;

        // Multi-level penalty calculation
        // Calculate cost for each threshold segment
        if (penalties != null && penalties.getThresholds() != null) {
            java.util.List<Integer> thresholds = penalties.getThresholds();
            java.util.List<Double> multipliers = penalties.getMultipliers();
            
            // Process each threshold level
            for (int i = 0; i < thresholds.size(); i++) {
                int threshold = thresholds.get(i);
                double multiplier = multipliers.get(i);
                
                if (current >= threshold) {
                    // Skip this threshold, already passed it
                    continue;
                }
                
                if (current < threshold && current < targetValue) {
                    // Calculate cost from current to this threshold (or to target if target is before this threshold)
                    Integer nextThresholdObj = (i + 1 < thresholds.size()) ? thresholds.get(i + 1) : null;
                    int nextThreshold = (nextThresholdObj != null) ? nextThresholdObj : Integer.MAX_VALUE;
                    int end = Math.min(targetValue, nextThreshold);
                    
                    if (current < threshold) {
                        end = Math.min(end, threshold);
                    }
                    
                    int diff = end - current;
                    if (diff > 0) {
                        if (current < threshold && end > threshold) {
                            // Cost spans from before threshold to after - split it
                            int diffBefore = threshold - current;
                            totalCost += diffBefore * costPerPoint * 1.0; // Before threshold: 1x
                            totalCost += (end - threshold) * costPerPoint * multiplier;
                            current = end;
                        } else if (end <= threshold) {
                            // Entirely before threshold
                            totalCost += diff * costPerPoint * 1.0;
                            current = end;
                        } else {
                            // Entirely at or above threshold
                            totalCost += diff * costPerPoint * multiplier;
                            current = end;
                        }
                    }
                }
            }
            
            // Cost for anything above the last threshold
            if (current < targetValue) {
                double lastMultiplier = multipliers.get(multipliers.size() - 1);
                int diff = targetValue - current;
                totalCost += diff * costPerPoint * lastMultiplier;
            }
        }

        return (int) Math.round(totalCost);
    }

    /**
     * Taban seviyeinden hedef seviyeye gitmek için gereken toplam puanı hesaplar.
     */
    public int getCostFromBase(String skill, int targetValue) {
        int baseValue = rulesService.getBaseValue(skill);
        int costBetween = getCostBetween(skill, baseValue, targetValue);
        System.out.println(skill + ": " + costBetween);
        return costBetween;
    }

    /**
     * Player'ın tüm özellik ve becerilerini iyileştirmek için gereken toplam XP'yi hesaplar.
     * Sonuç Player nesnesinde usedXP ve remainingXP olarak ayarlanır.
     */
    public Player calculateXP(Player player) throws XPCalculationMismatchException {
        // Characteristics
        int APP = getCostBetween("APP", rulesService.getBaseValue("APP"), player.getAPP());
        int BONUS = getCostBetween("BONUS", rulesService.getBaseValue("BONUS"), player.getBONUS());
        int BRV = getCostBetween("BRV", rulesService.getBaseValue("BRV"), player.getBRV());
        int CON = getCostBetween("STA", rulesService.getBaseValue("STA"), player.getCON());
        int DEX = getCostBetween("AGI", rulesService.getBaseValue("AGI"), player.getDEX());
        int EDU = getCostBetween("EDU", rulesService.getBaseValue("EDU"), player.getEDU());
        int INT = getCostBetween("INT", rulesService.getBaseValue("INT"), player.getINT());
        int LUCK = getCostBetween("LUCK", rulesService.getBaseValue("LUCK"), player.getLUCK());
        int SENSE = getCostBetween("SENSE", rulesService.getBaseValue("SENSE"), player.getSENSE());
        int WILL = getCostBetween("WILL", rulesService.getBaseValue("WILL"), player.getWILL());
        int STATUS = getCostBetween("STATUS", rulesService.getBaseValue("STATUS"), player.getSTATUS());
        int SAN = getCostBetween("SAN", rulesService.getBaseValue("SAN"), player.getSAN());
        int SIZ = getCostBetween("SIZ", rulesService.getBaseValue("SIZ"), player.getSIZ());
        int STR = getCostBetween("STR", rulesService.getBaseValue("STR"), player.getSTR());
        int ARMOR = getCostBetween("ARMOR", rulesService.getBaseValue("ARMOR"), player.getARMOR());
        int RES = getCostBetween("RES", rulesService.getBaseValue("RES"), player.getRES());

        // Skills
        int Accounting = getCostBetween("Accounting", rulesService.getBaseValue("Accounting"), player.getAccounting());
        int Anthropology = getCostBetween("Anthropology", rulesService.getBaseValue("Anthropology"), player.getAnthropology());
        int Appraise = getCostBetween("Appraise", rulesService.getBaseValue("Appraise"), player.getAppraise());
        int Archeology = getCostBetween("Archeology", rulesService.getBaseValue("Archeology"), player.getArcheology());
        int ArtCraft = getCostBetween("Art Craft", rulesService.getBaseValue("Art Craft"), player.getArtCraft());
        int ArtCraft2 = getCostBetween("Art Craft 2", rulesService.getBaseValue("Art Craft 2"), player.getArtCraft2());
        int Charm = getCostBetween("Charm", rulesService.getBaseValue("Charm"), player.getCharm());
        int Climb = getCostBetween("Climb", rulesService.getBaseValue("Climb"), player.getClimb());
        int CreditRating = getCostBetween("Credit Rating", rulesService.getBaseValue("Credit Rating"), player.getCreditRating());
        int CthulhuMythos = getCostBetween("Cthulhu Mythos", rulesService.getBaseValue("Cthulhu Mythos"), player.getCthulhuMythos());
        int Disguise = getCostBetween("Disguise", rulesService.getBaseValue("Disguise"), player.getDisguise());
        int Dodge = getCostBetween("Dodge", rulesService.getBaseValue("Dodge"), player.getDodge());
        int DriveAuto = getCostBetween("Drive Auto", rulesService.getBaseValue("Drive Auto"), player.getDriveAuto());
        int ElectricalRepair = getCostBetween("Electrical Repair", rulesService.getBaseValue("Electrical Repair"), player.getElectricalRepair());
        int FastTalk = getCostBetween("Fast Talk", rulesService.getBaseValue("Fast Talk"), player.getFastTalk());
        int FightingBrawl = getCostBetween("Fighting Brawl", rulesService.getBaseValue("Fighting Brawl"), player.getFightingBrawl());
        int FightingOther = getCostBetween("Fighting Other", rulesService.getBaseValue("Fighting Other"), player.getFightingOther());
        int FirearmsHandgun = getCostBetween("Firearms Handgun", rulesService.getBaseValue("Firearms Handgun"), player.getFirearmsHandgun());
        int FirearmsOther = getCostBetween("Firearms Other", rulesService.getBaseValue("Firearms Other"), player.getFirearmsOther());
        int FirearmsRifle = getCostBetween("Firearms Rifle Shotgun", rulesService.getBaseValue("Firearms Rifle Shotgun"), player.getFirearmsRifleShotgun());
        int FirstAid = getCostBetween("First Aid", rulesService.getBaseValue("First Aid"), player.getFirstAid());
        int History = getCostBetween("History", rulesService.getBaseValue("History"), player.getHistory());
        int Intimidate = getCostBetween("Intimidate", rulesService.getBaseValue("Intimidate"), player.getIntimidate());
        int Jump = getCostBetween("Jump", rulesService.getBaseValue("Jump"), player.getJump());
        int LanguageOther1 = getCostBetween("Language Other 1", rulesService.getBaseValue("Language Other 1"), player.getLanguageOther1());
        int LanguageOther2 = getCostBetween("Language Other 2", rulesService.getBaseValue("Language Other 2"), player.getLanguageOther2());
        int LanguageOther3 = getCostBetween("Language Other 3", rulesService.getBaseValue("Language Other 3"), player.getLanguageOther3());
        int LanguageOwn = getCostBetween("Language Own", rulesService.getBaseValue("Language Own"), player.getLanguageOwn());
        int Law = getCostBetween("Law", rulesService.getBaseValue("Law"), player.getLaw());
        int LibraryUse = getCostBetween("Library Use", rulesService.getBaseValue("Library Use"), player.getLibraryUse());
        int Listen = getCostBetween("Listen", rulesService.getBaseValue("Listen"), player.getListen());
        int Locksmith = getCostBetween("Locksmith", rulesService.getBaseValue("Locksmith"), player.getLocksmith());
        int MechanicalRepair = getCostBetween("Mechanical Repair", rulesService.getBaseValue("Mechanical Repair"), player.getMechanicalRepair());
        int Medicine = getCostBetween("Medicine", rulesService.getBaseValue("Medicine"), player.getMedicine());
        int NaturalWorld = getCostBetween("Natural World", rulesService.getBaseValue("Natural World"), player.getNaturalWorld());
        int Navigate = getCostBetween("Navigate", rulesService.getBaseValue("Navigate"), player.getNavigate());
        int Occult = getCostBetween("Occult", rulesService.getBaseValue("Occult"), player.getOccult());
        int Persuade = getCostBetween("Persuade", rulesService.getBaseValue("Persuade"), player.getPersuade());
        int Pilot = getCostBetween("Pilot", rulesService.getBaseValue("Pilot"), player.getPilot());
        int Psychoanalysis = getCostBetween("Psychoanalysis", rulesService.getBaseValue("Psychoanalysis"), player.getPsychoanalysis());
        int Psychology = getCostBetween("Psychology", rulesService.getBaseValue("Psychology"), player.getPsychology());
        int Ride = getCostBetween("Ride", rulesService.getBaseValue("Ride"), player.getRide());
        int Science = getCostBetween("Science", rulesService.getBaseValue("Science"), player.getScience());
        int ScienceOther = getCostBetween("Science Other", rulesService.getBaseValue("Science Other"), player.getScienceOther());
        int ScienceOther2 = getCostBetween("Science Other 2", rulesService.getBaseValue("Science Other 2"), player.getScienceOther2());
        int SleightOfHand = getCostBetween("Sleight Of Hand", rulesService.getBaseValue("Sleight Of Hand"), player.getSleightOfHand());
        int SPOT = getCostBetween("SPOT", rulesService.getBaseValue("SPOT"), player.getSPOT());
        int Stealth = getCostBetween("Stealth", rulesService.getBaseValue("Stealth"), player.getStealth());
        int Survival = getCostBetween("Survival", rulesService.getBaseValue("Survival"), player.getSurvival());
        int Swim = getCostBetween("Swim", rulesService.getBaseValue("Swim"), player.getSwim());
        int ThrowSkill = getCostBetween("Throw", rulesService.getBaseValue("Throw"), player.getThrow());
        int Track = getCostBetween("Track", rulesService.getBaseValue("Track"), player.getTrack());
        int Other1 = getCostBetween("Other1", rulesService.getBaseValue("Other1"), player.getOther1());
        int Other2 = getCostBetween("Other2", rulesService.getBaseValue("Other2"), player.getOther2());
        int Other3 = getCostBetween("Other3", rulesService.getBaseValue("Other3"), player.getOther3());

        // TOPLAM - SPOT is a characteristic, not a skill
        int totalCost =
                APP + BONUS + BRV + CON + DEX + EDU + INT + LUCK + SENSE + WILL + STATUS + SAN + SIZ + STR + ARMOR + RES + SPOT +
                        Accounting + Anthropology + Appraise + Archeology + ArtCraft + ArtCraft2 + Charm + Climb +
                        CreditRating + CthulhuMythos + Disguise + Dodge + DriveAuto + ElectricalRepair + FastTalk +
                        FightingBrawl + FightingOther + FirearmsHandgun + FirearmsOther + FirearmsRifle +
                        FirstAid + History + Intimidate + Jump + LanguageOther1 + LanguageOther2 + LanguageOther3 +
                        LanguageOwn + Law + LibraryUse + Listen + Locksmith + MechanicalRepair + Medicine +
                        NaturalWorld + Navigate + Occult + Persuade + Pilot + Psychoanalysis + Psychology + Ride +
                        Science + ScienceOther + ScienceOther2 + SleightOfHand + Stealth + Survival +
                        Swim + ThrowSkill + Track + Other1 + Other2 + Other3;
        
        if(player.getUsedXP() != totalCost) {
            throw new XPCalculationMismatchException(totalCost, player.getUsedXP());
        }
        
        player.setUsedXP(totalCost);
        player.setRemainingXP(player.getTotalXP() - totalCost);
        
        // Calculate and set player level based on used XP
        RulesSpec.LevelRules levelRules = rulesService.getLevelRules();
        if (levelRules != null) {
            int level = levelRules.calculateLevel(totalCost);
            player.setLevel(level);
        }
        
        return player;
    }
}
