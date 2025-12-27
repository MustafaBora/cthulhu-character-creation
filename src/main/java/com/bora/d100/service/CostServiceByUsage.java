package com.bora.d100.service;

import org.springframework.stereotype.Service;

import com.bora.d100.dto.RulesSpec;
import com.bora.d100.exception.XPCalculationMismatchException;
import com.bora.d100.model.Player;

/**
 * Cost calculation service based on usage rules.
 * Uses RulesService to load all calculation parameters from a single source of truth.
 * USAGE: 1 yükseltme için kaç puan harcaması gerektiğini gösterir.
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
     * Penalti sistemi CostService ile aynıdır.
     */
    public int getCostBetween(String skill, int currentValue, int targetValue) {
        int usage = rulesService.getUsageCost(skill);
        RulesSpec.PenaltyRules penalties = rulesService.getPenaltyRules();

        // Hiç iyileştirme yoksa maliyet sıfır
        if (targetValue <= currentValue || usage == 0) {
            return 0;
        }

        int totalCost = 0;
        int current = currentValue;

        // Parça 1: Mevcut seviye → firstThreshold arası
        if (current < penalties.getFirstThreshold()) {
            int end = Math.min(targetValue, penalties.getFirstThreshold());
            int diff = end - current;
            totalCost += diff * usage;
            current = end;
        }

        // Parça 2: firstThreshold → secondThreshold arası (2x daha pahalı)
        if (current < penalties.getSecondThreshold() && current >= penalties.getFirstThreshold()) {
            int end = Math.min(targetValue, penalties.getSecondThreshold());
            int diff = end - current;
            totalCost += diff * usage * penalties.getFirstPenaltyMult();
            current = end;
        }

        // Parça 3: secondThreshold+ arası (3x daha pahalı)
        if (current < targetValue) {
            int diff = targetValue - current;
            totalCost += diff * usage * penalties.getSecondPenaltyMult();
        }

        return totalCost;
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
        int PER = getCostBetween("PER", rulesService.getBaseValue("PER"), player.getPER());
        int POW = getCostBetween("POW", rulesService.getBaseValue("POW"), player.getPOW());
        int REP = getCostBetween("REP", rulesService.getBaseValue("REP"), player.getREP());
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

        // TOPLAM
        int totalCost =
                APP + BONUS + BRV + CON + DEX + EDU + INT + LUCK + PER + POW + REP + SAN + SIZ + STR + ARMOR + RES + SPOT +
                        Accounting + Anthropology + Appraise + Archeology + ArtCraft + ArtCraft2 + Charm + Climb +
                        CreditRating + CthulhuMythos + Disguise + Dodge + DriveAuto + ElectricalRepair + FastTalk +
                        FightingBrawl + FightingOther + FirearmsHandgun + FirearmsOther + FirearmsRifle +
                        FirstAid + History + Intimidate + Jump + LanguageOther1 + LanguageOther2 + LanguageOther3 +
                        LanguageOwn + Law + LibraryUse + Listen + Locksmith + MechanicalRepair + Medicine +
                        NaturalWorld + Navigate + Occult + Persuade + Pilot + Psychoanalysis + Psychology + Ride +
                        Science + ScienceOther + ScienceOther2 + SleightOfHand + Stealth + Survival +
                        Swim + ThrowSkill + Track;
        
        if(player.getUsedXP() != totalCost) {
            throw new XPCalculationMismatchException(totalCost, player.getUsedXP());
        }
        
        player.setUsedXP(totalCost);
        player.setRemainingXP(player.getTotalXP() - totalCost);
        return player;
    }
}
