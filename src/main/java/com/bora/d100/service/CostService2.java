package com.bora.d100.service;

import com.bora.d100.model.Player;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CostService2 {

    private final Map<String, List<CostSegment>> curves = new HashMap<>();

    public CostService2() {

        // ---------- ATTRIBUTES ----------
        // Base ve Mult değerleri Excel'den
        register("APP",   30, 15);
        register("BONUS", 0,  12);
        register("BRV",   45, 6);
        register("CON",   30, 8);
        register("DEX",   35, 4);
        register("EDU",   20, 46);
        register("INT",   30, 14);
        register("LUCK",  35, 3);
        register("PER",   0,  5);
        register("POW",   30, 5);
        register("REP",   1,  14); // _Reputation
        register("SAN",   45, 3);
        register("SIZ",   31, 19);
        register("STR",   25, 11);

        // ---------- SKILLS ----------
        register("Accounting",      7,  50);
        register("Anthropology",    6,  50);
        register("Appraise",        8,  50);
        register("Archeology",      3,  50);
        register("ArtCraft",        15, 46); // Art/Craft
        register("ArtCraft2",       14, 46); // Art/Craft 2
        register("Charm",           20, 10);
        register("Climb",           20, 20);
        register("CreditRating",    5,  11); // Credit Rating
        register("CthulhuMythos",   0,  6);
        register("Disguise",        5,  27);
        register("Dodge",           20, 6);
        register("DriveAuto",       10, 16);
        register("ElectricalRepair",15, 25);
        register("FastTalk",        14, 10);
        register("FightingBrawl",   30, 7);  // Fighting (Brawl)
        register("FightingOther",   30, 8);  // Fighting (other 1/2)
        register("FirearmsHandgun", 30, 5);
        register("FirearmsOther",   30, 5);
        register("FirearmsOther2",  30, 5);  // ek slot
        register("FirearmsRifleShotgun", 30, 5);
        register("FirstAid",        20, 12);
        register("History",         10, 22);
        register("Intimidate",      15, 12);
        register("Jump",            20, 15);
        register("LanguageOther1",  20, 44);
        register("LanguageOther2",  0,  44);
        register("LanguageOther3",  0,  44);
        register("LanguageOwn",     50, 30);
        register("Law",             5,  29);
        register("LibraryUse",      20, 7);
        register("Listen",          30, 5);
        register("Locksmith",       10, 12);
        register("MechanicalRepair",15, 25);
        register("Medicine",        4,  28);
        register("NaturalWorld",    15, 21);
        register("Navigate",        15, 30);
        register("Occult",          4,  20);
        register("Persuade",        15, 7);
        register("Pilot",           1,  50); // Pilot(which)
        register("Psychoanalysis",  2,  50);
        register("Psychology",      10, 9);
        register("Ride",            10, 16);
        register("Science",         10, 30);
        register("ScienceOther",    21, 44);
        register("ScienceOther2",   20, 44);
        register("SleightOfHand",   10, 13);
        register("SpotHidden",      15, 5);
        register("Stealth",         20, 9);
        register("SurvivalChoose",  11, 50); // Survival (choose)
        register("Swim",            22, 42);
        register("Throw",           20, 12);
        register("Track",           10, 27);

        // Default eğri (bilinmeyen skill ismi gelirse)
        curves.put("_DEFAULT", buildSegments(0, 20)); // tamamen keyfi
    }


    public Player updatePlayerXP(Player player) {
        int totalXP = player.getTotalXP();

        int usedXP = 0;

        // 1) Stat / attribute isimleri
        String[] attributes = {
                "APP", "BONUS", "BRV", "CON", "DEX", "EDU",
                "INT", "LUCK", "PER", "POW", "REP", "SAN",
                "SIZ", "STR"
        };

        for (String attr : attributes) {
            int value = player.getSkill(attr);
            usedXP += getCostFromBase(attr, value);
        }

        // 2) Skill isimleri
        String[] skills = {
                "Accounting",
                "Anthropology",
                "Appraise",
                "Archeology",
                "ArtCraft",
                "ArtCraft2",
                "Charm",
                "Climb",
                "CreditRating",
                "CthulhuMythos",
                "Disguise",
                "Dodge",
                "DriveAuto",
                "ElectricalRepair",
                "FastTalk",
                "FightingBrawl",
                "FightingOther",
                "FirearmsHandgun",
                "FirearmsOther",
                "FirearmsOther2",
                "FirearmsRifleShotgun",
                "FirstAid",
                "History",
                "Intimidate",
                "Jump",
                "LanguageOther1",
                "LanguageOther2",
                "LanguageOther3",
                "LanguageOwn",
                "Law",
                "LibraryUse",
                "Listen",
                "Locksmith",
                "MechanicalRepair",
                "Medicine",
                "NaturalWorld",
                "Navigate",
                "Occult",
                "Persuade",
                "Pilot",
                "Psychoanalysis",
                "Psychology",
                "Ride",
                "Science",
                "ScienceOther",
                "ScienceOther2",
                "SleightOfHand",
                "SpotHidden",
                "Stealth",
                "SurvivalChoose",
                "Swim",
                "Throw",
                "Track"
        };

        for (String skill : skills) {
            int value = player.getSkill(skill);
            usedXP += getCostFromBase(skill, value);
        }

        int remainingXP = totalXP - usedXP;
        if (remainingXP < 0) {
            //maybe an error
        }

        player.setUsedXP(usedXP);
        player.setRemainingXP(remainingXP);

        return player;
    }


    public int getCostFromBase(String skill, int requestedValue) {
        return this.getCostBetween(skill, 0, requestedValue);
    }

    public int getCostBetween(String skill, int currentValue, int requestedValue) {
        if (requestedValue <= currentValue) return 0;

        List<CostSegment> segments = curves.getOrDefault(skill, curves.get("_DEFAULT"));
        int total = 0;

        for (int v = currentValue; v < requestedValue; v++) {
            int next = v + 1;
            total += findCostPerPoint(segments, next);
        }

        return total;
    }

    private void register(String name, int base, int mult) {
        curves.put(name, buildSegments(base, mult));
    }

    /**
     * Esas sihir burada:
     * - 0 → base      : free (0 XP)
     * - base → 50     : cost1 XP / +1
     * - 50   → 70     : cost2 XP / +1 (daha pahalı)
     * - 70   → 100    : cost3 XP / +1 (en pahalı)
     *
     * cost1/cost2/cost3, eski mult oranına göre hesaplanıyor:
     *   mult büyükse (kolay skill)  → cost küçük
     *   mult küçükse (zor skill)   → cost büyük
     */
    private List<CostSegment> buildSegments(int base, int mult) {
        List<CostSegment> segments = new ArrayList<>();

        // 0 → base free
        if (base > 0) {
            segments.add(new CostSegment(0, Math.min(base, 101), 0));
        }

        // cost per point'leri mult'a göre hesapla
        int[] costs = computeCostsFromMultiplier(mult);
        int cost1 = costs[0];
        int cost2 = costs[1];
        int cost3 = costs[2];

        int start = base;

        // base → 50
        if (start < 50) {
            segments.add(new CostSegment(start, 50, cost1));
            start = 50;
        }

        // 50 → 70
        if (start < 70) {
            segments.add(new CostSegment(start, 70, cost2));
            start = 70;
        }

        // 70 → 100
        if (start < 101) {
            segments.add(new CostSegment(start, 101, cost3));
        }

        return segments;
    }

    /**
     * Eski sistemde:
     *   1 XP → mult kadar skill puanı
     * idi.
     *
     * Yeni sistemde:
     *   costPerPoint ≈ sabit / mult
     * + daha yüksek değerler için çarpanı arttır.
     *
     * Buradaki 40 / 80 / 140 sayıları tamamen ayarlanabilir;
     * oranları korumak için varlar.
     */
    private int[] computeCostsFromMultiplier(int mult) {
        // mult ne kadar büyükse, cost o kadar düşük olsun.
        double c1raw = 40.0 / mult;   // base → 50
        double c2raw = 80.0 / mult;   // 50 → 70
        double c3raw = 140.0 / mult;  // 70 →

        int c1 = Math.max(1, (int) Math.round(c1raw));
        int c2 = Math.max(c1 + 1, (int) Math.round(c2raw));
        int c3 = Math.max(c2 + 1, (int) Math.round(c3raw));

        return new int[]{c1, c2, c3};
    }


    private int findCostPerPoint(List<CostSegment> segments, int value) {
        for (CostSegment s : segments) {
            if (s.contains(value)) {
                return s.getCostPerPoint();
            }
        }
        // Olmaması lazım; gene de patlarsa anlamlı bir hata atsın:
        throw new IllegalStateException("No cost segment defined for value " + value);
    }
}
