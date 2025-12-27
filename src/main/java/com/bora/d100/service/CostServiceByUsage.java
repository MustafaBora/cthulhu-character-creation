package com.bora.d100.service;

import com.bora.d100.exception.XPCalculationMismatchException;
import com.bora.d100.model.Player;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CostServiceByUsage {

    private static final Map<String, Integer> BASE = Map.<String, Integer>ofEntries(
            Map.entry("totalXP", 0),
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
            Map.entry("PER", 0),
            Map.entry("POW", 30),
            Map.entry("REP", 1),
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
            Map.entry("Spot Hidden", 15),
            Map.entry("Stealth", 20),
            Map.entry("Survival", 11),
            Map.entry("Swim", 22),
            Map.entry("Throw", 20),
            Map.entry("Track", 10)
    );

    /**
     * USAGE: 1 yükseltme için kaç puan harcaması gerektiğini gösterir.
     * Örneğin: APP = 3 demek, APP'yi 1 yükseltmek için 3 puan harcamanız gerekir.
     * Bu, CostService'deki MULT değerlerinin tersidir.
     */
    private static final Map<String, Integer> USAGE = Map.<String, Integer>ofEntries(
            Map.entry("totalXP", 0),
            Map.entry("usedXP", 0),
            Map.entry("remainingXP", 0),

            // Karakteristikler (Characteristics)
            Map.entry("APP", 60),
            Map.entry("BONUS", 120),
            Map.entry("BRV", 120),
            Map.entry("STA", 120),
            Map.entry("AGI", 220),
            Map.entry("EDU", 20),
            Map.entry("INT", 60),
            Map.entry("LUCK", 180),
            Map.entry("PER", 320),
            Map.entry("POW", 140),
            Map.entry("REP", 100),
            Map.entry("SAN", 160),
            Map.entry("SIZ", 40),
            Map.entry("STR", 100),
            Map.entry("ARMOR", 7000),
            Map.entry("RES", 7000),

            // Beceriler (Skills)
            Map.entry("Accounting", 20),
            Map.entry("Anthropology", 20),
            Map.entry("Appraise", 20),
            Map.entry("Archeology", 20),
            Map.entry("Art Craft", 20),
            Map.entry("Art Craft 2", 20),
            Map.entry("Charm", 120),
            Map.entry("Climb", 60),
            Map.entry("Credit Rating", 120),
            Map.entry("Cthulhu Mythos", 160),
            Map.entry("Disguise", 40),
            Map.entry("Dodge", 180),
            Map.entry("Drive Auto", 80),
            Map.entry("Electrical Repair", 40),
            Map.entry("Fast Talk", 120),
            Map.entry("Fighting Brawl", 160),
            Map.entry("Fighting Other", 160),
            Map.entry("Firearms Handgun", 160),
            Map.entry("Firearms Other", 140),
            Map.entry("Firearms Rifle Shotgun", 140),
            Map.entry("First Aid", 100),
            Map.entry("History", 60),
            Map.entry("Intimidate", 100),
            Map.entry("Jump", 80),
            Map.entry("Language Other 1", 40),
            Map.entry("Language Other 2", 20),
            Map.entry("Language Other 3", 20),
            Map.entry("Language Own", 20),
            Map.entry("Law", 40),
            Map.entry("Library Use", 160),
            Map.entry("Listen", 160),
            Map.entry("Locksmith", 120),
            Map.entry("Mechanical Repair", 40),
            Map.entry("Medicine", 40),
            Map.entry("Natural World", 60),
            Map.entry("Navigate", 40),
            Map.entry("Occult", 60),
            Map.entry("Persuade", 180),
            Map.entry("Pilot", 20),
            Map.entry("Psychoanalysis", 20),
            Map.entry("Psychology", 120),
            Map.entry("Ride", 80),
            Map.entry("Science", 40),
            Map.entry("Science Other", 20),
            Map.entry("Science Other 2", 20),
            Map.entry("Sleight Of Hand", 100),
            Map.entry("Spot Hidden", 260),
            Map.entry("Stealth", 140),
            Map.entry("Survival", 20),
            Map.entry("Swim", 20),
            Map.entry("Throw", 100),
            Map.entry("Track", 40)
    );

    private static final int FIRST_THRESHOLD = 50;
    private static final int SECOND_THRESHOLD = 75;
    private static final int FIRST_PENALTY_MULT = 2;
    private static final int SECOND_PENALTY_MULT = 3;

    /**
     * Belirli bir seviyeye ulaşmak için gereken toplam puanı hesaplar.
     * 
     * currentValue'dan targetValue'ye gitmek için kaç puan harcaması gerekir.
     * Penalti sistemi CostService ile aynıdır.
     */
    public int getCostBetween(String skill, int currentValue, int targetValue) {
        int usage = USAGE.get(skill);

        // Hiç iyileştirme yoksa maliyet sıfır
        if (targetValue <= currentValue || usage == 0) {
            return 0;
        }

        int totalCost = 0;
        int current = currentValue;

        // Parça 1: Mevcut seviye → 50 arası
        if (current < FIRST_THRESHOLD) {
            int end = Math.min(targetValue, FIRST_THRESHOLD);
            int diff = end - current;
            totalCost += diff * usage;
            current = end;
        }

        // Parça 2: 50 → 75 arası (2x daha pahalı)
        if (current < SECOND_THRESHOLD && current >= FIRST_THRESHOLD) {
            int end = Math.min(targetValue, SECOND_THRESHOLD);
            int diff = end - current;
            totalCost += diff * usage * FIRST_PENALTY_MULT;
            current = end;
        }

        // Parça 3: 75+ arası (3x daha pahalı)
        if (current < targetValue) {
            int diff = targetValue - current;
            totalCost += diff * usage * SECOND_PENALTY_MULT;
        }

        return totalCost;
    }

    /**
     * Taban seviyeinden (0) hedef seviyeye gitmek için gereken toplam puanı hesaplar.
     */
    public int getCostFromBase(String skill, int targetValue) {
        int costBetween = getCostBetween(skill, 0, targetValue);
        System.out.println(skill + ": " + costBetween);
        return costBetween;
    }

    /**
     * Player'ın tüm özellik ve becerilerini iyileştirmek için gereken toplam XP'yi hesaplar.
     * Sonuç Player nesnesinde usedXP ve remainingXP olarak ayarlanır.
     */
    public Player calculateXP(Player player) throws XPCalculationMismatchException {
        // Characteristics
        int APP = getCostBetween("APP", BASE.get("APP"), player.getAPP());
        int BONUS = getCostBetween("BONUS", BASE.get("BONUS"), player.getBONUS());
        int BRV = getCostBetween("BRV", BASE.get("BRV"), player.getBRV());
        int CON = getCostBetween("STA", BASE.get("STA"), player.getCON());
        int DEX = getCostBetween("AGI", BASE.get("AGI"), player.getDEX());
        int EDU = getCostBetween("EDU", BASE.get("EDU"), player.getEDU());
        int INT = getCostBetween("INT", BASE.get("INT"), player.getINT());
        int LUCK = getCostBetween("LUCK", BASE.get("LUCK"), player.getLUCK());
        int PER = getCostBetween("PER", BASE.get("PER"), player.getPER());
        int POW = getCostBetween("POW", BASE.get("POW"), player.getPOW());
        int REP = getCostBetween("REP", BASE.get("REP"), player.getREP());
        int SAN = getCostBetween("SAN", BASE.get("SAN"), player.getSAN());
        int SIZ = getCostBetween("SIZ", BASE.get("SIZ"), player.getSIZ());
        int STR = getCostBetween("STR", BASE.get("STR"), player.getSTR());
        int ARMOR = getCostBetween("ARMOR", BASE.get("ARMOR"), player.getARMOR());
        int RES = getCostBetween("RES", BASE.get("RES"), player.getRES());

        // Skills
        int Accounting = getCostBetween("Accounting", BASE.get("Accounting"), player.getAccounting());
        int Anthropology = getCostBetween("Anthropology", BASE.get("Anthropology"), player.getAnthropology());
        int Appraise = getCostBetween("Appraise", BASE.get("Appraise"), player.getAppraise());
        int Archeology = getCostBetween("Archeology", BASE.get("Archeology"), player.getArcheology());
        int ArtCraft = getCostBetween("Art Craft", BASE.get("Art Craft"), player.getArtCraft());
        int ArtCraft2 = getCostBetween("Art Craft 2", BASE.get("Art Craft 2"), player.getArtCraft2());
        int Charm = getCostBetween("Charm", BASE.get("Charm"), player.getCharm());
        int Climb = getCostBetween("Climb", BASE.get("Climb"), player.getClimb());
        int CreditRating = getCostBetween("Credit Rating", BASE.get("Credit Rating"), player.getCreditRating());
        int CthulhuMythos = getCostBetween("Cthulhu Mythos", BASE.get("Cthulhu Mythos"), player.getCthulhuMythos());
        int Disguise = getCostBetween("Disguise", BASE.get("Disguise"), player.getDisguise());
        int Dodge = getCostBetween("Dodge", BASE.get("Dodge"), player.getDodge());
        int DriveAuto = getCostBetween("Drive Auto", BASE.get("Drive Auto"), player.getDriveAuto());
        int ElectricalRepair = getCostBetween("Electrical Repair", BASE.get("Electrical Repair"), player.getElectricalRepair());
        int FastTalk = getCostBetween("Fast Talk", BASE.get("Fast Talk"), player.getFastTalk());
        int FightingBrawl = getCostBetween("Fighting Brawl", BASE.get("Fighting Brawl"), player.getFightingBrawl());
        int FightingOther = getCostBetween("Fighting Other", BASE.get("Fighting Other"), player.getFightingOther());
        int FirearmsHandgun = getCostBetween("Firearms Handgun", BASE.get("Firearms Handgun"), player.getFirearmsHandgun());
        int FirearmsOther = getCostBetween("Firearms Other", BASE.get("Firearms Other"), player.getFirearmsOther());
        int FirearmsRifle = getCostBetween("Firearms Rifle Shotgun", BASE.get("Firearms Rifle Shotgun"), player.getFirearmsRifleShotgun());
        int FirstAid = getCostBetween("First Aid", BASE.get("First Aid"), player.getFirstAid());
        int History = getCostBetween("History", BASE.get("History"), player.getHistory());
        int Intimidate = getCostBetween("Intimidate", BASE.get("Intimidate"), player.getIntimidate());
        int Jump = getCostBetween("Jump", BASE.get("Jump"), player.getJump());
        int LanguageOther1 = getCostBetween("Language Other 1", BASE.get("Language Other 1"), player.getLanguageOther1());
        int LanguageOther2 = getCostBetween("Language Other 2", BASE.get("Language Other 2"), player.getLanguageOther2());
        int LanguageOther3 = getCostBetween("Language Other 3", BASE.get("Language Other 3"), player.getLanguageOther3());
        int LanguageOwn = getCostBetween("Language Own", BASE.get("Language Own"), player.getLanguageOwn());
        int Law = getCostBetween("Law", BASE.get("Law"), player.getLaw());
        int LibraryUse = getCostBetween("Library Use", BASE.get("Library Use"), player.getLibraryUse());
        int Listen = getCostBetween("Listen", BASE.get("Listen"), player.getListen());
        int Locksmith = getCostBetween("Locksmith", BASE.get("Locksmith"), player.getLocksmith());
        int MechanicalRepair = getCostBetween("Mechanical Repair", BASE.get("Mechanical Repair"), player.getMechanicalRepair());
        int Medicine = getCostBetween("Medicine", BASE.get("Medicine"), player.getMedicine());
        int NaturalWorld = getCostBetween("Natural World", BASE.get("Natural World"), player.getNaturalWorld());
        int Navigate = getCostBetween("Navigate", BASE.get("Navigate"), player.getNavigate());
        int Occult = getCostBetween("Occult", BASE.get("Occult"), player.getOccult());
        int Persuade = getCostBetween("Persuade", BASE.get("Persuade"), player.getPersuade());
        int Pilot = getCostBetween("Pilot", BASE.get("Pilot"), player.getPilot());
        int Psychoanalysis = getCostBetween("Psychoanalysis", BASE.get("Psychoanalysis"), player.getPsychoanalysis());
        int Psychology = getCostBetween("Psychology", BASE.get("Psychology"), player.getPsychology());
        int Ride = getCostBetween("Ride", BASE.get("Ride"), player.getRide());
        int Science = getCostBetween("Science", BASE.get("Science"), player.getScience());
        int ScienceOther = getCostBetween("Science Other", BASE.get("Science Other"), player.getScienceOther());
        int ScienceOther2 = getCostBetween("Science Other 2", BASE.get("Science Other 2"), player.getScienceOther2());
        int SleightOfHand = getCostBetween("Sleight Of Hand", BASE.get("Sleight Of Hand"), player.getSleightOfHand());
        int SpotHidden = getCostBetween("Spot Hidden", BASE.get("Spot Hidden"), player.getSpotHidden());
        int Stealth = getCostBetween("Stealth", BASE.get("Stealth"), player.getStealth());
        int Survival = getCostBetween("Survival", BASE.get("Survival"), player.getSurvival());
        int Swim = getCostBetween("Swim", BASE.get("Swim"), player.getSwim());
        int ThrowSkill = getCostBetween("Throw", BASE.get("Throw"), player.getThrow());
        int Track = getCostBetween("Track", BASE.get("Track"), player.getTrack());

        // TOPLAM (FirearmsOther2 eklendi)
        int totalCost =
                APP + BONUS + BRV + CON + DEX + EDU + INT + LUCK + PER + POW + REP + SAN + SIZ + STR + ARMOR + RES +
                        Accounting + Anthropology + Appraise + Archeology + ArtCraft + ArtCraft2 + Charm + Climb +
                        CreditRating + CthulhuMythos + Disguise + Dodge + DriveAuto + ElectricalRepair + FastTalk +
                        FightingBrawl + FightingOther + FirearmsHandgun + FirearmsOther + FirearmsRifle +
                        FirstAid + History + Intimidate + Jump + LanguageOther1 + LanguageOther2 + LanguageOther3 +
                        LanguageOwn + Law + LibraryUse + Listen + Locksmith + MechanicalRepair + Medicine +
                        NaturalWorld + Navigate + Occult + Persuade + Pilot + Psychoanalysis + Psychology + Ride +
                        Science + ScienceOther + ScienceOther2 + SleightOfHand + SpotHidden + Stealth + Survival +
                        Swim + ThrowSkill + Track;
        if(player.getUsedXP() != totalCost) throw new XPCalculationMismatchException(totalCost, player.getUsedXP());
        player.setUsedXP(totalCost);
        player.setRemainingXP(player.getTotalXP() - totalCost);
        return player;
    }
}
