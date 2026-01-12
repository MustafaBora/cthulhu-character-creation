package com.bora.d100.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO {
    // IDs
    private Long id;
    
    // Character Basics
    private String avatar;
    private String avatarLink;
    private String player;
    private String name;
    private String birthPlace;
    private String pronoun;
    private String occupation;
    private String residence;
    
    // Character Background & Description
    private String personalDescription;
    private String traits;
    private String ideology;
    private String beliefs;
    
    // Inventory
    private String bagSurface;
    private String bagMiddle;
    private String bagDeep;
    
    // Relationships & History
    private String significantPeople;
    private String injuries;
    private String scars;
    private String phobies;
    private String manias;
    private String treasuredPossesions;
    
    // Mystical Elements
    private String arcaneTomes;
    private String spells;
    private String artifacts;
    
    // World Knowledge
    private String meaningfulLocations;
    private String encountersWithStrangeEntities;
    private String inspiration;
    private String alliesAndOrganisations;
    private String notes;
    
    // Character Stats
    private int age;
    private int totalXP;
    private int usedXP;
    private int remainingXP;
    private int level;
    private int Build;
    private String damageBonus;
    private int MP;
    private int HP;
    private int MOVE;
    
    // Characteristics
    private int APP;
    private int BONUS;
    private int BRV;
    private int CON;
    private int DEX;
    private int EDU;
    private int INT;
    private int LUCK;
    private int SENSE;
    private int WILL;
    private int SAN;
    private int SIZ;
    private int STR;
    private int ARMOR;
    private int RES;
    
    // Skills
    private int Accounting;
    private int AnimalHandling;
    private int Anthropology;
    private int Appraise;
    private int Archeology;
    private int ArtCraft;
    private int ArtCraft2;
    private int Artillery;
    private int Charm;
    private int Climb;
    private int ComputerUse;
    private int CreditRating;
    private int CthulhuMythos;
    private int Demolitions;
    private int Disguise;
    private int Dodge;
    private int DriveAuto;
    private int Electronics;
    private int ElectricalRepair;
    private int FastTalk;
    private int FightingBrawl;
    private int FightingOther;
    private int FirearmsHandgun;
    private int FirearmsOther;
    private int FirearmsRifleShotgun;
    private int FirstAid;
    private int History;
    private int Hypnosis;
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
    private int OperateHeavyMachinery;
    private int Persuade;
    private int Pilot;
    private int Psychoanalysis;
    private int Psychology;
    private int ReadLips;
    private int Ride;
    private int Science;
    private int ScienceOther;
    private int ScienceOther2;
    private int SignLanguage;
    private int Deception;
    private int SleightOfHand;
    private int SPOT;
    private int Status;
    private int Stealth;
    private int Survival;
    private int Swim;
    private int Throw;
    private int Track;
    private int UncommonLanguage;
    private int Other1;
    private int Other2;
    private int Other3;
    
    // Status
    private boolean readonly;
}
