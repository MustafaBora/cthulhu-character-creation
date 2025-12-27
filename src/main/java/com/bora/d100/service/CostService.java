package com.bora.d100.service;

import com.bora.d100.model.Player;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CostService {

    private static final int FIRST_THRESHOLD = 50;
    private static final int SECOND_THRESHOLD = 75;
    private static final int FIRSTPENALTYMULT = 50;
    private static final int SECONDPENALTYMULT = 75;


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
            Map.entry("SPOT", 15),
            Map.entry("Stealth", 20),
            Map.entry("Survival", 11),
            Map.entry("Swim", 22),
            Map.entry("Throw", 20),
            Map.entry("Track", 10)
    );

    private static final Map<String, Integer> MULT = Map.<String, Integer>ofEntries(
            Map.entry("totalXP", 0),
            Map.entry("usedXP", 0),
            Map.entry("remainingXP", 0),

            Map.entry("APP", 15),
            Map.entry("BONUS", 12),
            Map.entry("BRV", 6),
            Map.entry("STA", 8),
            Map.entry("AGI", 4),
            Map.entry("EDU", 46),
            Map.entry("INT", 14),
            Map.entry("LUCK", 3),
            Map.entry("PER", 5),
            Map.entry("POW", 5),
            Map.entry("REP", 14),
            Map.entry("SAN", 3),
            Map.entry("SIZ", 19),
            Map.entry("STR", 11),
            Map.entry("ARMOR", 1),
            Map.entry("RES", 1),

            Map.entry("Accounting", 50),
            Map.entry("Anthropology", 50),
            Map.entry("Appraise", 50),
            Map.entry("Archeology", 50),
            Map.entry("Art Craft", 46),
            Map.entry("Art Craft 2", 46),
            Map.entry("Charm", 10),
            Map.entry("Climb", 20),
            Map.entry("Credit Rating", 11),
            Map.entry("Cthulhu Mythos", 6),
            Map.entry("Disguise", 27),
            Map.entry("Dodge", 6),
            Map.entry("Drive Auto", 16),
            Map.entry("Electrical Repair", 25),
            Map.entry("Fast Talk", 10),
            Map.entry("Fighting Brawl", 7),
            Map.entry("Fighting Other", 8),
            Map.entry("Firearms Handgun", 8),
            Map.entry("Firearms Other", 5),
            Map.entry("Firearms Rifle Shotgun", 5),
            Map.entry("First Aid", 12),
            Map.entry("History", 22),
            Map.entry("Intimidate", 12),
            Map.entry("Jump", 15),
            Map.entry("Language Other 1", 40),
            Map.entry("Language Other 2", 60),
            Map.entry("Language Other 3", 80),
            Map.entry("Language Own", 60),
            Map.entry("Law", 29),
            Map.entry("Library Use", 7),
            Map.entry("Listen", 5),
            Map.entry("Locksmith", 12),
            Map.entry("Mechanical Repair", 25),
            Map.entry("Medicine", 28),
            Map.entry("Natural World", 21),
            Map.entry("Navigate", 30),
            Map.entry("Occult", 20),
            Map.entry("Persuade", 7),
            Map.entry("Pilot", 50),
            Map.entry("Psychoanalysis", 50),
            Map.entry("Psychology", 9),
            Map.entry("Ride", 16),
            Map.entry("Science", 30),
            Map.entry("Science Other", 44),
            Map.entry("Science Other 2", 44),
            Map.entry("Sleight Of Hand", 13),
            Map.entry("SPOT", 5),
            Map.entry("Stealth", 9),
            Map.entry("Survival", 50),
            Map.entry("Swim", 45),
            Map.entry("Throw", 12),
            Map.entry("Track", 27)
    );


    public int getCostBetween(String skill, int currentValue, int targetValue) {

        int base = BASE.get(skill);
        int mult = MULT.get(skill);

        if (targetValue <= currentValue) return 0;

        int totalCost = 0;

        // 1) base altı ücretsiz
        if (currentValue < base) {
            currentValue = base;
        }
        int end, diff;
        // Parça 1: base → 50 arası
        if (currentValue < FIRST_THRESHOLD) {
            end = Math.min(targetValue, FIRST_THRESHOLD);
            diff = end - currentValue;
            totalCost += Math.ceil((double) diff / mult);
            currentValue = end;
        }

        // Parça 2: 50 → 75 arası (daha pahalı)
        if (currentValue < SECOND_THRESHOLD && currentValue >= FIRST_THRESHOLD) {
            end = Math.min(targetValue, SECOND_THRESHOLD);
            diff = end - currentValue;
            totalCost += Math.ceil((double) diff / mult) * FIRSTPENALTYMULT ;
            currentValue = end;
        }

        // Parça 3: 75 → target arası (daha pahalı)
        if (currentValue < targetValue) {
            diff = targetValue - currentValue;
            totalCost += Math.ceil((double) diff / mult) * SECONDPENALTYMULT;
        }

        return totalCost;
    }

    public int getCostFromBase(String skill, int targetValue) {
        return getCostBetween(skill, 0, targetValue);
    }


    public Player calculateXP(Player player) {
        int APP = getCostFromBase("APP", player.getAPP());
        int BONUS = getCostFromBase("BONUS", player.getBONUS());
        int BRV = getCostFromBase("BRV", player.getBRV());
        int CON = getCostFromBase("STA", player.getCON());
        int DEX = getCostFromBase("AGI", player.getDEX());
        int EDU = getCostFromBase("EDU", player.getEDU());
        int INT = getCostFromBase("INT", player.getINT());
        int LUCK = getCostFromBase("LUCK", player.getLUCK());
        int PER = getCostFromBase("PER", player.getPER());
        int POW = getCostFromBase("POW", player.getPOW());
        int REP = getCostFromBase("REP", player.getREP());
        int SAN = getCostFromBase("SAN", player.getSAN());
        int SIZ = getCostFromBase("SIZ", player.getSIZ());
        int STR = getCostFromBase("STR", player.getSTR());
        int ARMOR = getCostFromBase("ARMOR", player.getARMOR());
        int RES = getCostFromBase("RES", player.getRES());

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
        int SPOT = getCostFromBase("SPOT", player.getSPOT());
        int Stealth = getCostFromBase("Stealth", player.getStealth());
        int Survival = getCostFromBase("Survival", player.getSurvival());
        int Swim = getCostFromBase("Swim", player.getSwim());
        int ThrowSkill = getCostFromBase("Throw", player.getThrow());
        int Track = getCostFromBase("Track", player.getTrack());

        // TOTAL
        int totalCost =
                APP + BONUS + BRV + CON + DEX + EDU + INT + LUCK + PER + POW + REP + SAN + SIZ + STR + ARMOR + RES +
                        Accounting + Anthropology + Appraise + Archeology + ArtCraft + ArtCraft2 + Charm + Climb +
                        CreditRating + CthulhuMythos + Disguise + Dodge + DriveAuto + ElectricalRepair + FastTalk +
                        FightingBrawl + FightingOther + FirearmsHandgun + FirearmsOther + FirearmsRifle +
                        FirstAid + History + Intimidate + Jump + LanguageOther1 + LanguageOther2 + LanguageOther3 +
                        LanguageOwn + Law + LibraryUse + Listen + Locksmith + MechanicalRepair + Medicine +
                        NaturalWorld + Navigate + Occult + Persuade + Pilot + Psychoanalysis + Psychology + Ride +
                        Science + ScienceOther + ScienceOther2 + SleightOfHand + SPOT + Stealth + Survival +
                        Swim + ThrowSkill + Track;
        player.setUsedXP(totalCost);
        player.setRemainingXP(player.getTotalXP() - totalCost);
        return player;
    }


}
