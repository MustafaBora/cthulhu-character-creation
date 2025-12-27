package com.bora.d100.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Lob
    @Column(name = "avatar")
    private String avatar;

    private String player;
    private String name;
    private String birthPlace;
    private String pronoun;
    private String occupation;
    private String residence;
    private int age;
    private int totalXP;

    private int usedXP;
    private int remainingXP;
    private int Build;
    private String damageBonus;
    private int MP;
    private int HP;
    private int MOVE;

    private int APP;
    private int BONUS;
    private int BRV;
    private int CON;
    private int DEX;
    private int EDU;
    private int INT;
    private int LUCK;
    private int PER;
    private int POW;
    private int REP;
    private int SAN;
    private int SIZ;
    private int STR;
    private int ARMOR;
    private int RES;

    private int Accounting;
    private int Anthropology;
    private int Appraise;
    private int Archeology;
    private int ArtCraft;
    private int ArtCraft2;
    private int Charm;
    private int Climb;
    private int CreditRating;
    private int CthulhuMythos;
    private int Disguise;
    private int Dodge;
    private int DriveAuto;
    private int ElectricalRepair;
    private int FastTalk;
    private int FightingBrawl;
    private int FightingOther;
    private int FirearmsHandgun;
    private int FirearmsOther;
    private int FirearmsRifleShotgun;
    private int FirstAid;
    private int History;
    private int Intimidate;
    private int Jump;
    private int LanguageOther1;
    private int LanguageOther2;
    private int LanguageOther3;
    private int LanguageOwn;
    private int Law;
    private int LibraryUse;
    private int Listen;
    private int Locksmith;
    private int MechanicalRepair;
    private int Medicine;
    private int NaturalWorld;
    private int Navigate;
    private int Occult;
    private int Persuade;
    private int Pilot;
    private int Psychoanalysis;
    private int Psychology;
    private int Ride;
    private int Science;
    private int ScienceOther;
    private int ScienceOther2;
    private int SleightOfHand;
    private int SPOT;
    private int Stealth;
    private int Survival;
    private int Swim;
    private int Throw;
    private int Track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User user;

    public int getSkill(String skill) {
        switch (skill) {
            // Characteristics
            case "APP": return APP;
            case "BONUS": return BONUS;
            case "BRV": return BRV;
            case "CON": return CON;
            case "DEX": return DEX;
            case "EDU": return EDU;
            case "INT": return INT;
            case "LUCK": return LUCK;
            case "PER": return PER;
            case "POW": return POW;
            case "REP": return REP;
            case "SAN": return SAN;
            case "SIZ": return SIZ;
            case "STR": return STR;
            case "ARMOR": return ARMOR;
            case "RES": return RES;
            case "Accounting": return Accounting;
            case "Anthropology": return Anthropology;
            case "Appraise": return Appraise;
            case "Archeology": return Archeology;
            case "ArtCraft": return ArtCraft;
            case "ArtCraft2": return ArtCraft2;
            case "Charm": return Charm;
            case "Climb": return Climb;
            case "CreditRating": return CreditRating;
            case "CthulhuMythos": return CthulhuMythos;
            case "Disguise": return Disguise;
            case "Dodge": return Dodge;
            case "DriveAuto": return DriveAuto;
            case "ElectricalRepair": return ElectricalRepair;
            case "FastTalk": return FastTalk;
            case "FightingBrawl": return FightingBrawl;
            case "FightingOther": return FightingOther;
            case "FirearmsHandgun": return FirearmsHandgun;
            case "FirearmsOther": return FirearmsOther;
            case "FirearmsRifleShotgun": return FirearmsRifleShotgun;
            case "FirstAid": return FirstAid;
            case "History": return History;
            case "Intimidate": return Intimidate;
            case "Jump": return Jump;
            case "LanguageOther1": return LanguageOther1;
            case "LanguageOther2": return LanguageOther2;
            case "LanguageOther3": return LanguageOther3;
            case "LanguageOwn": return LanguageOwn;
            case "Law": return Law;
            case "LibraryUse": return LibraryUse;
            case "Listen": return Listen;
            case "Locksmith": return Locksmith;
            case "MechanicalRepair": return MechanicalRepair;
            case "Medicine": return Medicine;
            case "NaturalWorld": return NaturalWorld;
            case "Navigate": return Navigate;
            case "Occult": return Occult;
            case "Persuade": return Persuade;
            case "Pilot": return Pilot;
            case "Psychoanalysis": return Psychoanalysis;
            case "Psychology": return Psychology;
            case "Ride": return Ride;
            case "Science": return Science;
            case "ScienceOther": return ScienceOther;
            case "ScienceOther2": return ScienceOther2;
            case "SleightOfHand": return SleightOfHand;
            case "SPOT": return SPOT;
            case "Stealth": return Stealth;
            case "Survival": return Survival;
            case "Swim": return Swim;
            case "Throw": return Throw;
            case "Track": return Track;
            default:
                throw new IllegalArgumentException("Unknown skill: " + skill);
        }
    }

    public void setSkill(String skill, int value) {
        switch (skill) {
            // Characteristics
            case "APP": APP = value; break;
            case "BONUS": BONUS = value; break;
            case "BRV": BRV = value; break;
            case "CON": CON = value; break;
            case "DEX": DEX = value; break;
            case "EDU": EDU = value; break;
            case "INT": INT = value; break;
            case "LUCK": LUCK = value; break;
            case "PER": PER = value; break;
            case "POW": POW = value; break;
            case "REP": REP = value; break;
            case "SAN": SAN = value; break;
            case "SIZ": SIZ = value; break;
            case "STR": STR = value; break;
            case "ARMOR": ARMOR = value; break;
            case "RES": RES = value; break;
            case "Accounting": Accounting = value; break;
            case "Anthropology": Anthropology = value; break;
            case "Appraise": Appraise = value; break;
            case "Archeology": Archeology = value; break;
            case "ArtCraft": ArtCraft = value; break;
            case "ArtCraft2": ArtCraft2 = value; break;
            case "Charm": Charm = value; break;
            case "Climb": Climb = value; break;
            case "CreditRating": CreditRating = value; break;
            case "CthulhuMythos": CthulhuMythos = value; break;
            case "Disguise": Disguise = value; break;
            case "Dodge": Dodge = value; break;
            case "DriveAuto": DriveAuto = value; break;
            case "ElectricalRepair": ElectricalRepair = value; break;
            case "FastTalk": FastTalk = value; break;
            case "FightingBrawl": FightingBrawl = value; break;
            case "FightingOther": FightingOther = value; break;
            case "FirearmsHandgun": FirearmsHandgun = value; break;
            case "FirearmsOther": FirearmsOther = value; break;
            case "FirearmsRifleShotgun": FirearmsRifleShotgun = value; break;
            case "FirstAid": FirstAid = value; break;
            case "History": History = value; break;
            case "Intimidate": Intimidate = value; break;
            case "Jump": Jump = value; break;
            case "LanguageOther1": LanguageOther1 = value; break;
            case "LanguageOther2": LanguageOther2 = value; break;
            case "LanguageOther3": LanguageOther3 = value; break;
            case "LanguageOwn": LanguageOwn = value; break;
            case "Law": Law = value; break;
            case "LibraryUse": LibraryUse = value; break;
            case "Listen": Listen = value; break;
            case "Locksmith": Locksmith = value; break;
            case "MechanicalRepair": MechanicalRepair = value; break;
            case "Medicine": Medicine = value; break;
            case "NaturalWorld": NaturalWorld = value; break;
            case "Navigate": Navigate = value; break;
            case "Occult": Occult = value; break;
            case "Persuade": Persuade = value; break;
            case "Pilot": Pilot = value; break;
            case "Psychoanalysis": Psychoanalysis = value; break;
            case "Psychology": Psychology = value; break;
            case "Ride": Ride = value; break;
            case "Science": Science = value; break;
            case "ScienceOther": ScienceOther = value; break;
            case "ScienceOther2": ScienceOther2 = value; break;
            case "SleightOfHand": SleightOfHand = value; break;
            case "SPOT": SPOT = value; break;
            case "Stealth": Stealth = value; break;
            case "Survival": Survival = value; break;
            case "Swim": Swim = value; break;
            case "Throw": Throw = value; break;
            case "Track": Track = value; break;
            default:
                throw new IllegalArgumentException("Unknown skill: " + skill);
        }
    }

    public void calculateMPAndHP () {
        this.setHP((this.getCON()+this.getSIZ())/10);
        this.setMP(this.getPOW()/5);
    }

    public void calculateBuildAndDB () {
        if(this.getSIZ() + this.getSTR() > 164) {
            this.setBuild(2);
            this.setDamageBonus("+1D6");
        }
        else if(this.getSIZ() + this.getSTR() > 124 && this.getSIZ() + this.getSTR() < 165) {
            this.setBuild(1);
            this.setDamageBonus("+1D3");
        }
        else if(this.getSIZ() + this.getSTR() > 84 && this.getSIZ() + this.getSTR() < 125) {
            this.setBuild(0);
            this.setDamageBonus("0");
        }
        else if(this.getSIZ() + this.getSTR() > 64 && this.getSIZ() + this.getSTR() < 85) {
            this.setBuild(-1);
            this.setDamageBonus("-1");
        }
        else if(this.getSIZ() + this.getSTR() > 2 && this.getSIZ() + this.getSTR() < 65) {
            this.setBuild(-2);
            this.setDamageBonus("-2");
        }
    }

    public void setValuesFromAnother(Player other) {
        if (other == null) {
            throw new IllegalArgumentException("Player to copy from cannot be null");
        }

        // --- Basics (ID + user intentionally excluded) ---
        this.avatar = other.getAvatar();
        this.player = other.getPlayer();
        this.name = other.getName();
        this.birthPlace = other.getBirthPlace();
        this.pronoun = other.getPronoun();
        this.occupation = other.getOccupation();
        this.residence = other.getResidence();
        this.age = other.getAge();

        // --- Progress / derived-ish fields ---
        this.totalXP = other.getTotalXP();
        this.usedXP = other.getUsedXP();
        this.remainingXP = other.getRemainingXP();
        this.Build = other.getBuild();
        this.damageBonus = other.getDamageBonus();
        this.MP = other.getMP();
        this.HP = other.getHP();
        this.MOVE = other.getMOVE();

        // --- Characteristics copied generically ---
        for (String c : CHARACTERISTICS) {
            this.setSkill(c, other.getSkill(c));
        }

        // --- Skills (single source of truth) ---
        for (String skill : SKILLS) {
            this.setSkill(skill, other.getSkill(skill));
        }

        // İstersen türetilenleri her zaman yeniden hesapla (MP/HP, BUILD/DB gibi):
        this.calculateMPAndHP();
        this.calculateBuildAndDB();
    }

        private static final String[] SKILLS = {
            "Accounting","Anthropology","Appraise","Archeology","ArtCraft","ArtCraft2",
            "Charm","Climb","CreditRating","CthulhuMythos","Disguise","Dodge","DriveAuto",
            "ElectricalRepair","FastTalk","FightingBrawl","FightingOther","FirearmsHandgun",
            "FirearmsOther","FirearmsRifleShotgun","FirstAid","History",
            "Intimidate","Jump","LanguageOther1","LanguageOther2","LanguageOther3","LanguageOwn",
            "Law","LibraryUse","Listen","Locksmith","MechanicalRepair","Medicine","NaturalWorld",
            "Navigate","Occult","Persuade","Pilot","Psychoanalysis","Psychology","Ride","Science",
            "ScienceOther","ScienceOther2","SleightOfHand","Stealth","Survival",
            "Swim","Throw","Track"
    };

        private static final String[] CHARACTERISTICS = {
            "APP","BONUS","BRV","CON","DEX","EDU","INT","LUCK","PER","POW",
            "REP","SAN","SIZ","STR","ARMOR","RES","SPOT"
        };
}
