package com.bora.d100.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
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
    private String occupation;
    private int age;
    private String sex;
    private String birthPlace;
    private int totalXP;

    private int usedXP;
    private int remainingXP;
    private int BUILD;
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
    private int FirearmsOther2;
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
    private int SpotHidden;
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
            case "FirearmsOther2": return FirearmsOther2;
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
            case "SpotHidden": return SpotHidden;
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
            case "FirearmsOther2": FirearmsOther2 = value; break;
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
            case "SpotHidden": SpotHidden = value; break;
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
            this.setBUILD(2);
            this.setDamageBonus("+1D6");
        }
        else if(this.getSIZ() + this.getSTR() > 124 && this.getSIZ() + this.getSTR() < 165) {
            this.setBUILD(1);
            this.setDamageBonus("+1D3");
        }
        else if(this.getSIZ() + this.getSTR() > 84 && this.getSIZ() + this.getSTR() < 125) {
            this.setBUILD(0);
            this.setDamageBonus("0");
        }
        else if(this.getSIZ() + this.getSTR() > 64 && this.getSIZ() + this.getSTR() < 85) {
            this.setBUILD(-1);
            this.setDamageBonus("-1");
        }
        else if(this.getSIZ() + this.getSTR() > 2 && this.getSIZ() + this.getSTR() < 65) {
            this.setBUILD(-2);
            this.setDamageBonus("-2");
        }
    }
    
    public void setValuesFromAnother(Player player) {
        // ID ve user hariç her şeyi overwrite edelim
        this.setPlayer(player.getPlayer());
        this.setName(player.getName());
        this.setOccupation(player.getOccupation());
        this.setAge(player.getAge());
        this.setSex(player.getSex());
        this.setBirthPlace(player.getBirthPlace());

        this.setTotalXP(player.getTotalXP());
        this.setUsedXP(player.getUsedXP());
        this.setRemainingXP(player.getRemainingXP());
        this.setBUILD(player.getBUILD());
        this.setDamageBonus(player.getDamageBonus());
        this.setMP(player.getMP());
        this.setHP(player.getHP());
        this.setMOVE(player.getMOVE());

        this.setAPP(player.getAPP());
        this.setBONUS(player.getBONUS());
        this.setBRV(player.getBRV());
        this.setCON(player.getCON());
        this.setDEX(player.getDEX());
        this.setEDU(player.getEDU());
        this.setINT(player.getINT());
        this.setLUCK(player.getLUCK());
        this.setPER(player.getPER());
        this.setPOW(player.getPOW());
        this.setREP(player.getREP());
        this.setSAN(player.getSAN());
        this.setSIZ(player.getSIZ());
        this.setSTR(player.getSTR());

        // skill set’leri de aynı şekilde:
        this.setAccounting(player.getAccounting());
        this.setAnthropology(player.getAnthropology());
        this.setAppraise(player.getAppraise());
        this.setArcheology(player.getArcheology());
        this.setArtCraft(player.getArtCraft());
        this.setArtCraft2(player.getArtCraft2());
        this.setCharm(player.getCharm());
        this.setClimb(player.getClimb());
        this.setCreditRating(player.getCreditRating());
        this.setCthulhuMythos(player.getCthulhuMythos());
        this.setDisguise(player.getDisguise());
        this.setDodge(player.getDodge());
        this.setDriveAuto(player.getDriveAuto());
        this.setElectricalRepair(player.getElectricalRepair());
        this.setFastTalk(player.getFastTalk());
        this.setFightingBrawl(player.getFightingBrawl());
        this.setFightingOther(player.getFightingOther());
        this.setFirearmsHandgun(player.getFirearmsHandgun());
        this.setFirearmsOther(player.getFirearmsOther());
        this.setFirearmsOther2(player.getFirearmsOther2());
        this.setFirearmsRifleShotgun(player.getFirearmsRifleShotgun());
        this.setFirstAid(player.getFirstAid());
        this.setHistory(player.getHistory());
        this.setIntimidate(player.getIntimidate());
        this.setJump(player.getJump());
        this.setLanguageOther1(player.getLanguageOther1());
        this.setLanguageOther2(player.getLanguageOther2());
        this.setLanguageOther3(player.getLanguageOther3());
        this.setLanguageOwn(player.getLanguageOwn());
        this.setLaw(player.getLaw());
        this.setLibraryUse(player.getLibraryUse());
        this.setListen(player.getListen());
        this.setLocksmith(player.getLocksmith());
        this.setMechanicalRepair(player.getMechanicalRepair());
        this.setMedicine(player.getMedicine());
        this.setNaturalWorld(player.getNaturalWorld());
        this.setNavigate(player.getNavigate());
        this.setOccult(player.getOccult());
        this.setPersuade(player.getPersuade());
        this.setPilot(player.getPilot());
        this.setPsychoanalysis(player.getPsychoanalysis());
        this.setPsychology(player.getPsychology());
        this.setRide(player.getRide());
        this.setScience(player.getScience());
        this.setScienceOther(player.getScienceOther());
        this.setScienceOther2(player.getScienceOther2());
        this.setSleightOfHand(player.getSleightOfHand());
        this.setSpotHidden(player.getSpotHidden());
        this.setStealth(player.getStealth());
        this.setSurvival(player.getSurvival());
        this.setSwim(player.getSwim());
        this.setThrow(player.getThrow());
        this.setTrack(player.getTrack());
    }
}
