package com.bora.d100.service;

import com.bora.d100.model.Player;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CostServiceByUsage {

    /**
     * USAGE: 1 yükseltme için kaç puan harcaması gerektiğini gösterir.
     * Örneğin: APP = 3 demek, APP'yi 1 yükseltmek için 3 puan harcamanız gerekir.
     * Bu, CostService'deki MULT değerlerinin tersidir.
     */
    private static final Map<String, Integer> USAGE = Map.ofEntries(
            Map.entry("totalXP", 0),
            Map.entry("usedXP", 0),
            Map.entry("remainingXP", 0),

            // Karakteristikler (Characteristics)
            Map.entry("APP", 60),
            Map.entry("BONUS", 0),
            Map.entry("BRV", 120),
            Map.entry("CON", 120),
            Map.entry("DEX", 220),
            Map.entry("EDU", 20),
            Map.entry("INT", 60),
            Map.entry("LUCK", 180),
            Map.entry("PER", 320),
            Map.entry("POW", 140),
            Map.entry("REP", 100),
            Map.entry("SAN", 160),
            Map.entry("SIZ", 40),
            Map.entry("STR", 100),

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
            Map.entry("Firearms Other 2", 140),
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
        return getCostBetween(skill, 0, targetValue);
    }

    /**
     * Player'ın tüm özellik ve becerilerini iyileştirmek için gereken toplam XP'yi hesaplar.
     * Sonuç Player nesnesinde usedXP ve remainingXP olarak ayarlanır.
     */
    public Player calculateXP(Player player) {
        int APP = getCostFromBase("APP", player.getAPP());
        int BONUS = getCostFromBase("BONUS", player.getBONUS());
        int BRV = getCostFromBase("BRV", player.getBRV());
        int CON = getCostFromBase("CON", player.getCON());
        int DEX = getCostFromBase("DEX", player.getDEX());
        int EDU = getCostFromBase("EDU", player.getEDU());
        int INT = getCostFromBase("INT", player.getINT());
        int LUCK = getCostFromBase("LUCK", player.getLUCK());
        int PER = getCostFromBase("PER", player.getPER());
        int POW = getCostFromBase("POW", player.getPOW());
        int REP = getCostFromBase("REP", player.getREP());
        int SAN = getCostFromBase("SAN", player.getSAN());
        int SIZ = getCostFromBase("SIZ", player.getSIZ());
        int STR = getCostFromBase("STR", player.getSTR());

        int Accounting = getCostFromBase("Accounting", player.getAccounting());
        int Anthropology = getCostFromBase("Anthropology", player.getAnthropology());
        int Appraise = getCostFromBase("Appraise", player.getAppraise());
        int Archeology = getCostFromBase("Archeology", player.getArcheology());
        int ArtCraft = getCostFromBase("Art Craft", player.getArtCraft());
        int ArtCraft2 = getCostFromBase("Art Craft 2", player.getArtCraft2());
        int Charm = getCostFromBase("Charm", player.getCharm());
        int Climb = getCostFromBase("Climb", player.getClimb());
        int CreditRating = getCostFromBase("Credit Rating", player.getCreditRating());
        int CthulhuMythos = getCostFromBase("Cthulhu Mythos", player.getCthulhuMythos());
        int Disguise = getCostFromBase("Disguise", player.getDisguise());
        int Dodge = getCostFromBase("Dodge", player.getDodge());
        int DriveAuto = getCostFromBase("Drive Auto", player.getDriveAuto());
        int ElectricalRepair = getCostFromBase("Electrical Repair", player.getElectricalRepair());
        int FastTalk = getCostFromBase("Fast Talk", player.getFastTalk());
        int FightingBrawl = getCostFromBase("Fighting Brawl", player.getFightingBrawl());
        int FightingOther = getCostFromBase("Fighting Other", player.getFightingOther());
        int FirearmsHandgun = getCostFromBase("Firearms Handgun", player.getFirearmsHandgun());
        int FirearmsOther = getCostFromBase("Firearms Other", player.getFirearmsOther());
        int FirearmsRifle = getCostFromBase("Firearms Rifle Shotgun", player.getFirearmsRifleShotgun());
        int FirstAid = getCostFromBase("First Aid", player.getFirstAid());
        int History = getCostFromBase("History", player.getHistory());
        int Intimidate = getCostFromBase("Intimidate", player.getIntimidate());
        int Jump = getCostFromBase("Jump", player.getJump());
        int LanguageOther1 = getCostFromBase("Language Other 1", player.getLanguageOther1());
        int LanguageOther2 = getCostFromBase("Language Other 2", player.getLanguageOther2());
        int LanguageOther3 = getCostFromBase("Language Other 3", player.getLanguageOther3());
        int LanguageOwn = getCostFromBase("Language Own", player.getLanguageOwn());
        int Law = getCostFromBase("Law", player.getLaw());
        int LibraryUse = getCostFromBase("Library Use", player.getLibraryUse());
        int Listen = getCostFromBase("Listen", player.getListen());
        int Locksmith = getCostFromBase("Locksmith", player.getLocksmith());
        int MechanicalRepair = getCostFromBase("Mechanical Repair", player.getMechanicalRepair());
        int Medicine = getCostFromBase("Medicine", player.getMedicine());
        int NaturalWorld = getCostFromBase("Natural World", player.getNaturalWorld());
        int Navigate = getCostFromBase("Navigate", player.getNavigate());
        int Occult = getCostFromBase("Occult", player.getOccult());
        int Persuade = getCostFromBase("Persuade", player.getPersuade());
        int Pilot = getCostFromBase("Pilot", player.getPilot());
        int Psychoanalysis = getCostFromBase("Psychoanalysis", player.getPsychoanalysis());
        int Psychology = getCostFromBase("Psychology", player.getPsychology());
        int Ride = getCostFromBase("Ride", player.getRide());
        int Science = getCostFromBase("Science", player.getScience());
        int ScienceOther = getCostFromBase("Science Other", player.getScienceOther());
        int ScienceOther2 = getCostFromBase("Science Other 2", player.getScienceOther2());
        int SleightOfHand = getCostFromBase("Sleight Of Hand", player.getSleightOfHand());
        int SpotHidden = getCostFromBase("Spot Hidden", player.getSpotHidden());
        int Stealth = getCostFromBase("Stealth", player.getStealth());
        int Survival = getCostFromBase("Survival", player.getSurvival());
        int Swim = getCostFromBase("Swim", player.getSwim());
        int ThrowSkill = getCostFromBase("Throw", player.getThrow());
        int Track = getCostFromBase("Track", player.getTrack());

        // TOPLAM
        int totalCost =
                APP + BONUS + BRV + CON + DEX + EDU + INT + LUCK + PER + POW + REP + SAN + SIZ + STR +
                        Accounting + Anthropology + Appraise + Archeology + ArtCraft + ArtCraft2 + Charm + Climb +
                        CreditRating + CthulhuMythos + Disguise + Dodge + DriveAuto + ElectricalRepair + FastTalk +
                        FightingBrawl + FightingOther + FirearmsHandgun + FirearmsOther + FirearmsRifle +
                        FirstAid + History + Intimidate + Jump + LanguageOther1 + LanguageOther2 + LanguageOther3 +
                        LanguageOwn + Law + LibraryUse + Listen + Locksmith + MechanicalRepair + Medicine +
                        NaturalWorld + Navigate + Occult + Persuade + Pilot + Psychoanalysis + Psychology + Ride +
                        Science + ScienceOther + ScienceOther2 + SleightOfHand + SpotHidden + Stealth + Survival +
                        Swim + ThrowSkill + Track;

        player.setUsedXP(totalCost);
        player.setRemainingXP(player.getTotalXP() - totalCost);
        return player;
    }
}
