import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "./config";
import defaultAvatar from "./assets/default-avatar.png";
import frameHorizontalShort from "./assets/horizontal-short.png";
import frameVertical from "./assets/vertical.png";
import frameVerticalShort from "./assets/vertical-short.png";
import cornerTL from "./assets/signs-1.png";
import cornerTR from "./assets/signs-2.png";
import cornerBL from "./assets/signs-3.png";
import cornerBR from "./assets/signs-4.png";
import LanguageSwitcher from "./LanguageSwitcher";
import "./PlayerForm.css";
import { useConnectivity } from "./ConnectivityProvider";

// Debug mode kontrolü - All X butonlarını göstermek için true yapın
const DEBUGMODE = true;

/**
 * Updated PlayerForm.jsx to use backend RulesSpec with multi-level penalties
 * Loads rules from GET /api/rules instead of hardcoding them
 * Supports 9 penalty levels: 10(1x), 20(2x), 30(3x), 40(4x), 50(5x), 60(6x), 70(7x), 80(8x), 90(9x)
 */

const RULES_CACHE_KEY = "rulesCache";

const FIELD_DEFS = [
  { key: "Accounting", label: "Accounting", type: "number" },
  { key: "AnimalHandling", label: "Animal Handle", type: "number" },
  { key: "Anthropology", label: "Anthropology", type: "number" },
  { key: "Appraise", label: "Appraise", type: "number" },
  { key: "Archeology", label: "Archeology", type: "number" },
  { key: "ArtCraft", label: "Art/Craft", type: "number" },
  { key: "ArtCraft2", label: "Art/Craft 2", type: "number" },
  { key: "Artillery", label: "Artillery", type: "number" },
  { key: "Charm", label: "Charm", type: "number" },
  { key: "Climb", label: "Climb", type: "number" },
  { key: "ComputerUse", label: "Computer Use", type: "number" },
  { key: "CreditRating", label: "Credit Rating", type: "number" },
  { key: "CthulhuMythos", label: "Cthulhu Myths", type: "number" },
  { key: "Deception", label: "Deception", type: "number" },
  { key: "Demolitions", label: "Demolitions", type: "number" },
  { key: "Disguise", label: "Disguise", type: "number" },
  { key: "Dodge", label: "Dodge", type: "number" },
  { key: "DriveAuto", label: "Drive (Auto)", type: "number" },
  { key: "Electronics", label: "Electronics", type: "number" },
  { key: "ElectricalRepair", label: "Electrics", type: "number" },
  { key: "FastTalk", label: "Fast Talk", type: "number" },
  { key: "FightingBrawl", label: "Fighting Brawl", type: "number" },
  { key: "FightingOther", label: "FO________", type: "number" },
  { key: "FirearmsHandgun", label: "Handgun", type: "number" },
  { key: "FirearmsOther", label: "FA-O______", type: "number" },
  { key: "FirearmsRifleShotgun", label: "FA Rifles", type: "number" },
  { key: "FirstAid", label: "First Aid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Hypnosis", label: "Hypnosis", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "LO1_______", type: "number" },
  { key: "LanguageOther2", label: "LO2_______", type: "number" },
  { key: "LanguageOther3", label: "LO3_______", type: "number" },
  { key: "LanguageOwn", label: "Language", type: "number" },
  { key: "Law", label: "Law", type: "number" },
  { key: "LibraryUse", label: "Library Use", type: "number" },
  { key: "Listen", label: "Listen", type: "number" },
  { key: "Locksmith", label: "Locksmith", type: "number" },
  { key: "MechanicalRepair", label: "Mechanics", type: "number" },
  { key: "Medicine", label: "Medicine", type: "number" },
  { key: "NaturalWorld", label: "Natural World", type: "number" },
  { key: "Navigate", label: "Navigate", type: "number" },
  { key: "Occult", label: "Occult", type: "number" },
  { key: "OperateHeavyMachinery", label: "Operate Heavy", type: "number" },
  { key: "Persuade", label: "Persuade", type: "number" },
  { key: "Pilot", label: "Pilot", type: "number" },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number" },
  { key: "Psychology", label: "Psychology", type: "number" },
  { key: "ReadLips", label: "Read Lips", type: "number" },
  { key: "Ride", label: "Ride", type: "number" },
  { key: "Science", label: "Science _____", type: "number" },
  { key: "ScienceOther", label: "SO _______", type: "number" },
  { key: "ScienceOther2", label: "SO2 _____", type: "number" },
  { key: "SignLanguage", label: "Sign Language", type: "number" },
  { key: "SleightOfHand", label: "Sleight of Hand", type: "number" },
  { key: "Status", label: "Status", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival ____", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
  { key: "UncommonLanguage", label: "Uncommon Language", type: "number" },
  { key: "Other1", label: "O1 _______", type: "number" },
  { key: "Other2", label: "O2 _______", type: "number" },
  { key: "Other3", label: "O3 _______", type: "number" },
];

// Characteristic descriptions for tooltips
const CHARACTERISTIC_DESCRIPTIONS = {
  "APP": "Appearance - Physical attractiveness and charm, effects first impressions",
  "BONUS": "Consumable, gives decrease for any skills per session",
  "BRV": "Bravery - Resistance to fear and psychological trauma, tests the character when player decides to face a frightening situation",
  "STA": "Constitution and Stamina - Physical endurance and toughness, running, drinking contests, resistance against poison or against torture",
  "AGI": "Agility - Speed, reflexes, and coordination, may give an extra round on fights",
  "EDU": "Education - Professional skills and schooling",
  "INT": "Intelligence - Reasoning and analytical ability, may be used to make an IDEA roll when stuck",
  "LUCK": "Luck - Chance and fortune",
  "SENSE": "Sense - Intuition and gut feelings, it is an automatic SPOT roll",
  "SPOT": "Spot - Ability to notice details in your surroundings",
  "WILL": "Willpower - Mental strength and determination, may be used in resisting mental attacks or magical influence",
  "SAN": "Sanity - Mental health (0 = insane, 99 = perfectly sane)",
  "SIZ": "Size - Physical bulk and body mass, affects hit points (HP)",
  "ARMOR": "Armor - Protection from damage, minus damage from every attack",
  "RES": "Resilience - Resistance to magical effects, decreases sanity loss from unknoen encounters",
  "STR": "Strength - Physical power and muscular force",
};

// Map human-readable labels to canonical characteristic keys used in rulesSpec
const CHARACTERISTIC_LABEL_TO_KEY = {
  "Strength": "STR",
  "Size": "SIZ",
  "Stamina": "STA",
  "Will": "WILL",
  "Agility": "AGI",
  "Education": "EDU",
  "Luck": "LUCK",
  "Intellect": "INT",
  "Appearance": "APP",
  "Bonus": "BONUS",
  "Spot Hidden": "SPOT",
  "Sense": "SENSE",
  "Sanity": "SAN",
  "Bravery": "BRV",
  "Armor": "ARMOR",
  "Resiliance": "RES", // Note: label spelling preserved in UI
};

// Skill descriptions for tooltips
const SKILL_DESCRIPTIONS = {
  "Accounting": "Managing finances, bookkeeping, and financial analysis",
  "AnimalHandling": "Training and caring for animals",
  "Anthropology": "Study of human cultures and societies",
  "Appraise": "Determining the value of items and objects",
  "Archeology": "Excavation and study of ancient artifacts",
  "ArtCraft": "Creating art or crafting items",
  "ArtCraft2": "Creating art or crafting items (specialized)",
  "Artillery": "Operating large weapons and cannons",
  "Charm": "Persuading and influencing others through charisma",
  "Climb": "Scaling walls and climbing structures",
  "ComputerUse": "Operating computers and computer systems",
  "CreditRating": "Determining financial standing and resources",
  "CthulhuMythos": "Knowledge of ancient eldritch horrors",
  "Deception": "Lying and creating false impressions",
  "Demolitions": "Explosives and controlled destruction",
  "Disguise": "Changing appearance and looking like someone else",
  "Dodge": "Avoiding attacks and incoming damage",
  "DriveAuto": "Operating automobiles",
  "Electronics": "Repairing and understanding electronics",
  "ElectricalRepair": "Fixing electrical systems and wiring",
  "FastTalk": "Deceiving with quick talking and smooth words",
  "FightingBrawl": "Hand-to-hand combat and brawling",
  "FightingOther": "Combat with specialized weapons",
  "FirearmsHandgun": "Using revolvers and pistols",
  "FirearmsOther": "Using other types of firearms",
  "FirearmsRifleShotgun": "Using rifles and shotguns",
  "FirstAid": "Basic medical treatment and wound care, 1 HP heal",
  "History": "Knowledge of historical events and periods",
  "Hypnosis": "Putting others in a hypnotic state",
  "Intimidate": "Frightening and threatening others",
  "Jump": "Leaping and long jumping",
  "LanguageOther1": "Speaking a foreign language",
  "LanguageOther2": "Speaking another foreign language",
  "LanguageOther3": "Speaking a third foreign language",
  "LanguageOwn": "Native language proficiency",
  "Law": "Legal knowledge and understanding of laws",
  "LibraryUse": "Researching in libraries and archives",
  "Listen": "Hearing and detecting sounds",
  "Locksmith": "Opening locks and disarming traps",
  "MechanicalRepair": "Fixing mechanical devices and machines",
  "Medicine": "Diagnosis and treatment of diseases, takes more time and heals 1d4 HP",
  "NaturalWorld": "Knowledge of nature and wildlife",
  "Navigate": "Navigation and finding directions",
  "Occult": "Knowledge of the supernatural and mystical",
  "OperateHeavyMachinery": "Operating large industrial machines",
  "Persuade": "Convincing others through logic and reason",
  "Pilot": "Flying aircraft and helicopters",
  "Psychoanalysis": "Understanding and analyzing the mind",
  "Psychology": "Understanding human behavior and motivation",
  "ReadLips": "Understanding speech by reading lips",
  "Ride": "Riding horses and other mount animals",
  "Science": "General scientific knowledge and research",
  "ScienceOther": "Specialized scientific knowledge",
  "ScienceOther2": "Another specialized scientific field",
  "SignLanguage": "Sign language communication",
  "SleightOfHand": "Picking pockets and sleight of hand",
  "Status": "Social standing and reputation",
  "Stealth": "Moving quietly and hiding",
  "Survival": "Surviving in wilderness environments",
  "Swim": "Swimming and underwater movement",
  "Throw": "Throwing objects accurately",
  "Track": "Following tracks and trails",
  "UncommonLanguage": "Speaking an uncommon or rare language",
};

// Skills that must always remain visible in print, regardless of value
const MUST_HAVE_SKILLS = new Set([
  "Climb",
  "CthulhuMythos",
  "Dodge",
  "LanguageOwn",
  "Listen",
  "Deception",
  "FastTalk",
  "FirearmsHandgun",
  "FirstAid",
  "NaturalWorld",
  "Swim",
  "Charm",
  "CreditRating",
  "FightingBrawl",
  "Jump",
  "LibraryUse",
  "Navigate",
  "Persuade",
  "Psychology",
  "Stealth",
  "Throw",
]);

// Background questions (3 columns x 3 rows for now, can expand dynamically)
const BACKGROUND_ROWS = [
  [
    { key: "bagSurface", label: "Bag Surface" },
    { key: "significantPeople", label: "Significant People" },
    { key: "injuriesScarsPhobiesManias", label: "Injuries, Scars, Phobies, Manias" },
  ],
  [
    { key: "bagMiddle", label: "Bag Middle" },
    { key: "treasuredPossessions", label: "Treasured Possesions" },
    { key: "arcaneTomesSpellsArtifacts", label: "Arcane Tomes, Spells, Artifacts" },
  ],
  [
    { key: "bagDeep", label: "Bag Deep" },
    { key: "meaningfulLocations", label: "Meaningful Locations" },
    { key: "encountersWithStrangeEntities", label: "Encounters with Strange Entities" },
  ],
];
const BACKGROUND_KEYS = BACKGROUND_ROWS.flat().map((c) => c.key);

function createFallbackRulesSpec() {
  const base = {
    totalXP: 200000,
    usedXP: 0,
    remainingXP: 0,
    APP: 30,
    BONUS: 0,
    BRV: 45,
    CON: 30,
    AGI: 35,
    EDU: 20,
    INT: 30,
    LUCK: 35,
    SENSE: 10,
    WILL: 30,
    STATUS: 1,
    SAN: 45,
    SIZ: 31,
    STR: 25,
    ARMOR: 0,
    RES: 0,
    Accounting: 7,
    "Animal Handling": 9,
    Anthropology: 6,
    Appraise: 8,
    Archeology: 3,
    "Art Craft": 15,
    "Art Craft 2": 14,
    Artillery: 0,
    Charm: 20,
    Climb: 20,
    "Computer Use": 0,
    "Credit Rating": 5,
    "Cthulhu Mythos": 0,
    Deception: 10,
    Demolitions: 1,
    Disguise: 5,
    Dodge: 20,
    "Drive Auto": 10,
    Electronics: 1,
    "Electrical Repair": 15,
    "Fast Talk": 14,
    "Fighting Brawl": 30,
    "Fighting Other": 30,
    "Firearms Handgun": 30,
    "Firearms Other": 30,
    "Firearms Rifle Shotgun": 30,
    "First Aid": 20,
    History: 10,
    Intimidate: 15,
    Jump: 20,
    "Language Other 1": 20,
    "Language Other 2": 0,
    "Language Other 3": 0,
    "Language Own": 50,
    Law: 5,
    "Library Use": 20,
    Listen: 30,
    Locksmith: 10,
    "Mechanical Repair": 15,
    Medicine: 4,
    "Natural World": 15,
    Navigate: 15,
    Occult: 4,
    "Operate Heavy Machinery": 1,
    Persuade: 15,
    Pilot: 1,
    Psychoanalysis: 2,
    Psychology: 10,
    "Read Lips": 1,
    Ride: 10,
    Science: 10,
    "Science Other": 21,
    "Science Other 2": 20,
    "Sign Language": 0,
    "Sleight Of Hand": 10,
    SPOT: 15,
    Stealth: 20,
    Survival: 11,
    Swim: 22,
    Throw: 20,
    Track: 10,
    "Uncommon Language": 1,
    Other1: 0,
    Other2: 0,
    Other3: 0,
  };

  const cost = {
    totalXP: 0,
    usedXP: 0,
    remainingXP: 0,
    APP: 60,
    BONUS: 150,
    BRV: 110,
    CON: 140,
    AGI: 180,
    EDU: 50,
    INT: 65,
    LUCK: 180,
    SENSE: 350,
    SPOT: 250,
    WILL: 200,
    STATUS: 200,
    SAN: 160,
    SIZ: 120,
    STR: 120,
    ARMOR: 15000,
    RES: 15000,
    Accounting: 20,
    "Animal Handling": 90,
    Anthropology: 20,
    Appraise: 30,
    Archeology: 20,
    "Art Craft": 40,
    "Art Craft 2": 40,
    Artillery: 90,
    Charm: 120,
    Climb: 70,
    "Computer Use": 90,
    "Credit Rating": 130,
    "Cthulhu Mythos": 2,
    Deception: 130,
    Demolitions: 90,
    Disguise: 60,
    Dodge: 160,
    "Drive Auto": 90,
    Electronics: 90,
    "Electrical Repair": 50,
    "Fast Talk": 120,
    "Fighting Brawl": 120,
    "Fighting Other": 120,
    "Firearms Handgun": 160,
    "Firearms Other": 140,
    "Firearms Rifle Shotgun": 140,
    "First Aid": 90,
    History: 60,
    Hypnosis: 210,
    Intimidate: 110,
    Jump: 100,
    "Language Other 1": 20,
    "Language Other 2": 20,
    "Language Other 3": 20,
    "Language Own": 20,
    Law: 70,
    "Library Use": 160,
    Listen: 160,
    Locksmith: 110,
    "Mechanical Repair": 50,
    Medicine: 50,
    "Natural World": 80,
    Navigate: 40,
    Occult: 140,
    "Operate Heavy Machinery": 40,
    Persuade: 170,
    Pilot: 30,
    Psychoanalysis: 30,
    Psychology: 170,
    "Read Lips": 190,
    Ride: 90,
    Science: 50,
    "Science Other": 50,
    "Science Other 2": 50,
    "Sign Language": 20,
    "Sleight Of Hand": 120,
    Stealth: 120,
    Survival: 30,
    Swim: 30,
    Throw: 100,
    Track: 40,
    "Uncommon Language": 200,
    Other1: 50,
    Other2: 100,
    Other3: 150,
  };

  return {
    base,
    cost,
    penaltyRules: {
      thresholds: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      multipliers: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
    },
    levelRules: {
      baseXP: 100000,
      xpPerLevel: 10000,
    },
  };
}

// Cost değerine göre renk döndürür - Yeşil → Sarı → Kırmızı → Mor → Siyah
function getCostColor(cost) {
  // Smooth gradient: Light Green → Green → Yellow → Orange → Red → Dark Red → Purple → Black
  if (cost < 40) return "#c8e6c9";        // very light green (0-39)
  if (cost < 80) return "#a5d6a7";        // light green (40-79)
  if (cost < 120) return "#81c784";       // mild green (80-119)
  if (cost < 160) return "#66bb6a";       // medium green (120-159)
  if (cost < 220) return "#4caf50";       // decent green (160-219)
  if (cost < 280) return "#43a047";       // strong green (220-279)
  if (cost < 420) return "#fbc02d";       // yellow (340-399)
  if (cost < 560) return "#fb8c00";       // orange (480-559)
  if (cost < 660) return "#f57c00";       // dark orange (560-659)
  if (cost < 800) return "#e64a19";       // orange-red (660-799)
  if (cost < 1300) return "#d32f2f";      // dark red (1000-1299)
  if (cost < 1700) return "#c62828";      // darker red (1300-1699)
  if (cost < 2200) return "#ae248a";      // purple (1700-2199)
  if (cost < 2800) return "#6a1b9a";      // dark purple (2200-2799)
  if (cost < 3500) return "#4a148c";      // darker purple (2800-3499)
  if (cost < 5000) return "#2c2c2c";      // very dark gray (3500-4999)
  return "#0a0a0a";                       // black (5000+)
}

// Buton yazı rengi: Sarı durumlarda siyah, koyu kırmızı ve sonrası açık, başta koyu
function getCostTextColor(cost) {
  if (cost >= 280 && cost < 400) return "#1a1a1a";  // sarı durumlarda siyah
  if (cost >= 400) return "#e0e7d5";                // kırmızı, mor, siyahta açık
  return "#0d1e15";                                 // yeşil durumlarda koyu
}

/**
 * Belirli bir değerde 1 puan artırmanın maliyeti (multi-level threshold penaltileriyle)
 * Supports 9 penalty levels: 10->1x, 20->2x, 30->3x, 40->4x, 50->5x, 60->6x, 70->7x, 80->8x, 90->9x
 */
function getCurrentCostPerPoint(rulesSpec, costPerPoint, value) {
  if (!rulesSpec || !rulesSpec.penaltyRules) return 0;
  if (costPerPoint === undefined || costPerPoint === null) return 0;
  
  const { thresholds, multipliers } = rulesSpec.penaltyRules;
  
  if (!thresholds || !multipliers || thresholds.length === 0) return costPerPoint;
  
  // Find which multiplier applies to current value
  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i]) {
      // Check if we're in this bracket or a higher one
      if (i === thresholds.length - 1 || value < thresholds[i + 1]) {
        return costPerPoint * multipliers[i];
      }
    }
  }
  
  return costPerPoint; // Before first threshold: base cost (1x multiplier)
}

/**
 * Belirli bir seviyeye ulaşmak için gereken toplam puanı hesaplar.
 * Updated to match backend logic exactly with multi-level penalties
 */
function getCostBetween(rulesSpec, skill, currentValue, targetValue) {
  if (!rulesSpec) return 0;
  
  const cost = rulesSpec.cost[skill] ?? 0;
  const { thresholds, multipliers } = rulesSpec.penaltyRules;

  // Hiç iyileştirme yoksa maliyet sıfır
  if (targetValue <= currentValue || cost === 0) {
    return 0;
  }

  if (!thresholds || !multipliers || thresholds.length === 0) {
    // No penalty system, just linear cost
    return (targetValue - currentValue) * cost;
  }

  let totalCost = 0;
  let current = currentValue;

  // Process each threshold level (matching backend logic)
  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    const multiplier = multipliers[i];
    
    if (current >= threshold) {
      // Skip this threshold, already passed it
      continue;
    }
    
    if (current < threshold && current < targetValue) {
      // Calculate cost from current to this threshold (or to target if target is before this threshold)
      const nextThreshold = (i + 1 < thresholds.length) ? thresholds[i + 1] : Number.MAX_SAFE_INTEGER;
      let end = Math.min(targetValue, nextThreshold);
      
      if (current < threshold) {
        end = Math.min(end, threshold);
      }
      
      const diff = end - current;
      if (diff > 0) {
        if (current < threshold && end > threshold) {
          // Cost spans from before threshold to after - split it
          const diffBefore = threshold - current;
          totalCost += diffBefore * cost * 1.0; // Before threshold: 1x
          totalCost += (end - threshold) * cost * multiplier;
          current = end;
        } else if (end <= threshold) {
          // Entirely before threshold
          totalCost += diff * cost * 1.0;
          current = end;
        } else {
          // Entirely at or above threshold
          totalCost += diff * cost * multiplier;
          current = end;
        }
      }
    }
  }
  
  // Cost for anything above the last threshold
  if (current < targetValue) {
    const lastMultiplier = multipliers[multipliers.length - 1];
    const diff = targetValue - current;
    totalCost += diff * cost * lastMultiplier;
  }

  return Math.round(totalCost);
}

/**
 * Player'ın tüm özellik ve becerilerini iyileştirmek için gereken toplam XP'yi hesaplar.
 * Updated to use rulesSpec from backend
 */
function computeUsedXP(rulesSpec, values) {
  if (!rulesSpec) return 0;
  
  let sum = 0;
  
  // Characteristics
  const characteristics = ["APP", "BONUS", "BRV", "CON", "AGI", "EDU", "INT", "LUCK", "SENSE", "SPOT", "WILL", "SAN", "SIZ", "ARMOR", "RES", "STR"];
  for (const key of characteristics) {
    const v = Number(values[key]) || 0;
    const baseValue = rulesSpec.base[key] ?? 0;
    const cost = getCostBetween(rulesSpec, key, baseValue, v);
    sum += cost;
  }
  
  // Skills - using backend key names (with spaces)
  
  // Map frontend keys to backend keys for skills
  const skillKeyMap = {
    "AnimalHandling": "Animal Handling",
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "Artillery": "Artillery",
    "ComputerUse": "Computer Use",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "Deception": "Deception",
    "Demolitions": "Demolitions",
    "DriveAuto": "Drive Auto",
    "Electronics": "Electronics",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "Hypnosis": "Hypnosis",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "OperateHeavyMachinery": "Operate Heavy Machinery",
    "ReadLips": "Read Lips",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SignLanguage": "Sign Language",
    "SleightOfHand": "Sleight Of Hand",
    "Status": "Status",
    "UncommonLanguage": "Uncommon Language",
    "Other1": "Other1",
    "Other2": "Other2",
    "Other3": "Other3"
  };
  
  // Calculate cost for each skill using FIELD_DEFS
  for (const def of FIELD_DEFS) {
    if (def.type !== "number") continue;
    
    const frontendKey = def.key;
    const backendKey = skillKeyMap[frontendKey] || frontendKey;
    const v = Number(values[frontendKey]) || 0;
    const baseValue = rulesSpec.base[backendKey] ?? 0;
    const cost = getCostBetween(rulesSpec, backendKey, baseValue, v);
    sum += cost;
  }
  return sum;
}

function applyDerived(rulesSpec, values) {
  if (!rulesSpec) return values;
  
  const v = (k) => Number(values[k]) || 0;
  const updated = { ...values };

  updated.HP = Math.floor((v("CON") + v("SIZ")) / 10);
  updated.MP = Math.floor(v("WILL") / 5);

  const sum = v("SIZ") + v("STR");
  if (sum > 164) {
    updated.Build = 2;
    updated.damageBonus = "+1D6";
  } else if (sum > 124 && sum < 165) {
    updated.Build = 1;
    updated.damageBonus = "+1D3";
  } else if (sum > 84 && sum < 125) {
    updated.Build = 0;
    updated.damageBonus = "0";
  } else if (sum > 64 && sum < 85) {
    updated.Build = -1;
    updated.damageBonus = "-1";
  } else if (sum > 2 && sum < 65) {
    updated.Build = -2;
    updated.damageBonus = "-2";
  } else {
    updated.Build = 0;
    updated.damageBonus = "0";
  }

  const agi = v("AGI");
  const siz = v("SIZ");
  const str = v("STR");
  let move = 8;
  if (agi > siz && agi > str) move = 9;
  else if (agi < siz && agi < str) move = 7;
  updated.MOVE = move;

  const usedXP = computeUsedXP(rulesSpec, updated);
  const totalXP = v("totalXP");
  updated.usedXP = usedXP;
  updated.remainingXP = totalXP - usedXP;
  
  // Calculate level based on used XP - minimum level is always 1
  if (rulesSpec.levelRules) {
    const { baseXP, xpPerLevel } = rulesSpec.levelRules;
    const level = Math.max(1, Math.floor((usedXP - baseXP) / xpPerLevel));
    updated.level = level;
  } else {
    updated.level = 1;
  }

  return updated;
}

function clampStat(rulesSpec, num, fieldName) {
  if (!rulesSpec) return num;
  
  // Map frontend keys to backend keys
  const skillKeyMap = {
    "AnimalHandling": "Animal Handling",
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "Artillery": "Artillery",
    "ComputerUse": "Computer Use",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "Deception": "Deception",
    "Demolitions": "Demolitions",
    "DriveAuto": "Drive Auto",
    "Electronics": "Electronics",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "Hypnosis": "Hypnosis",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "OperateHeavyMachinery": "Operate Heavy Machinery",
    "ReadLips": "Read Lips",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SleightOfHand": "Sleight Of Hand",
    "Status": "Status",
    "UncommonLanguage": "Uncommon Language"
  };
  
  const backendKey = skillKeyMap[fieldName] || fieldName;
  
  let n = Number(num) || 0;
  const minValue = rulesSpec.base[backendKey] ? rulesSpec.base[backendKey] : 0;
  if (n < minValue) n = minValue;
  // ARMOR ve RES için max 1, diğerleri için max 90
  const maxValue = (fieldName === 'ARMOR' || fieldName === 'RES') ? 1 : 90;
  if (n > maxValue) n = maxValue;
  return n;
}

function resolveAvatarSrc(player) {
  const normalize = (src) => {
    if (!src) return null;
    if (typeof src === "string" && src.startsWith("data:")) return src;
    if (typeof src === "string" && src.length > 100) return `data:image/*;base64,${src}`;
    if (typeof src === "string") {
      const publicBase = process.env.PUBLIC_URL || "";
      if (src.startsWith("http://") || src.startsWith("https://")) return src;
      if (src.startsWith("/")) return `${publicBase}${src}`;
      return `${publicBase}/${src}`;
    }
    return src;
  };

  return normalize(player?.avatar) || normalize(player?.avatarLink) || defaultAvatar;
}

function getInitialForm(rulesSpec, mode, player) {
  if (!rulesSpec) return {};
  
  // Map frontend keys to backend keys
  const skillKeyMap = {
    "AnimalHandling": "Animal Handling",
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "Artillery": "Artillery",
    "ComputerUse": "Computer Use",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "Deception": "Deception",
    "Demolitions": "Demolitions",
    "DriveAuto": "Drive Auto",
    "Electronics": "Electronics",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "Hypnosis": "Hypnosis",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "OperateHeavyMachinery": "Operate Heavy Machinery",
    "ReadLips": "Read Lips",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SignLanguage": "Sign Language",
    "SleightOfHand": "Sleight Of Hand",
    "Status": "STATUS",
    "UncommonLanguage": "Uncommon Language"
  };
  
  if (mode === "create") {
    // Yeni oyuncu oluşturma
    const obj = {
      player: "",
      name: "",
      occupation: "",
      pronoun: "",
      residence: "",
      age: 25,
      sex: "",
      birthPlace: "",
      totalXP: 200000,
      usedXP: 0,
      remainingXP: 200000,
      level: 1,
      Build: 0,
      damageBonus: "0",
      MP: 0,
      HP: 0,
      MOVE: 8,
      ARMOR: 0,
      RES: 0,
      avatar: "",
      avatarLink: "",
    };

    // Background fields
    BACKGROUND_KEYS.forEach((k) => {
      obj[k] = "";
    });

    // Karakteristikler için BASE değerlerini başlangıç olarak ayarla
    for (const key of Object.keys(rulesSpec.base)) {
      obj[key] = rulesSpec.base[key] ?? obj[key];
    }

    // FIELD_DEFS'teki her skill için backend key ile base değeri al
    for (const def of FIELD_DEFS) {
      if (def.type === "number") {
        const backendKey = skillKeyMap[def.key] || def.key;
        obj[def.key] = rulesSpec.base[backendKey] ?? 0;
      } else {
        obj[def.key] = "";
      }
    }

    return applyDerived(rulesSpec, obj);
  } else {
    // Edit modu
    const baseObj = applyDerived(rulesSpec, {
      ...player,
      // Map backend CON/DEX to frontend CON/AGI for consistency in the UI
      CON: player?.CON ?? 0,
      AGI: player?.DEX ?? player?.AGI ?? 0,
      SENSE: player?.SENSE ?? player?.PER ?? 0,
      Status: player?.Status ?? player?.STATUS ?? player?.REP ?? 0,
      ARMOR: player?.ARMOR ?? player?.armor ?? 0,
      RES: player?.RES ?? player?.res ?? 0,
      avatar: player?.avatar || "",
      avatarLink: player?.avatarLink || "",
    });

    // Missing fields: default to rules base values so minimums are visible
    Object.entries(rulesSpec.base).forEach(([k, v]) => {
      if (baseObj[k] === undefined) baseObj[k] = v;
    });

    // Ensure every FIELD_DEFS numeric exists
    FIELD_DEFS.forEach((def) => {
      if (def.type === "number" && baseObj[def.key] === undefined) {
        const backendKey = def.key;
        baseObj[def.key] = rulesSpec.base[backendKey] ?? 0;
      }
    });

    // If player already had XP/level info (e.g., offline sample), keep it
    if (player?.usedXP !== undefined) {
      baseObj.usedXP = Number(player.usedXP) || 0;
      const rem = player.remainingXP !== undefined ? Number(player.remainingXP) : baseObj.totalXP - baseObj.usedXP;
      baseObj.remainingXP = rem;
    }
    if (player?.level !== undefined) {
      baseObj.level = player.level;
    }

    // Ensure background fields exist even if backend doesn't have them
    BACKGROUND_KEYS.forEach((k) => {
      if (baseObj[k] === undefined) baseObj[k] = "";
    });

    return baseObj;
  }
}

function saveOfflinePlayer(payload, mode, player) {
  const key = "offlinePlayers";
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  if (mode === "create" || !player?.id) {
    const record = { ...payload, id: Date.now(), _isOfflineCreated: true };
    const next = [...list, record];
    localStorage.setItem(key, JSON.stringify(next));
    return record;
  }

  // Preserve _isOfflineCreated flag if it exists
  const existing = list.find((p) => p.id === player.id);
  const next = list.map((p) => 
    p.id === player.id 
      ? { ...payload, id: player.id, _isOfflineCreated: existing?._isOfflineCreated } 
      : p
  );
  localStorage.setItem(key, JSON.stringify(next));
  return { ...payload, id: player.id, _isOfflineCreated: existing?._isOfflineCreated };
}

function deleteOfflinePlayer(id) {
  const key = "offlinePlayers";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const next = list.filter((p) => p.id !== id);
  localStorage.setItem(key, JSON.stringify(next));
}

// Tooltip component with hover effect
function Tooltip({ text, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!text) return children;
  
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span
        style={{
          cursor: "help",
          marginLeft: "0.25rem",
          display: "inline-block",
          color: "#8b7d6b",
          fontWeight: "bold",
          fontSize: "0.85rem",
          verticalAlign: "text-top"
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        ⓘ
      </span>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "0",
            backgroundColor: "#3e3a2f",
            color: "#f5f3e8",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.35rem",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            zIndex: 9999,
            marginBottom: "0.5rem",
            border: "1px solid #8b7d6b",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0.5rem",
              width: "0",
              height: "0",
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid #3e3a2f",
            }}
          />
        </div>
      )}
    </div>
  );
}

function StatCell({ rulesSpec, label, value, onChange, onBlur, onDelta, base, cost, readOnly = false, isSmallStep = false, className = "" }) {
  const handleChange = readOnly
    ? undefined
    : (e) => onChange && onChange(e.target.value);

  const handleBlur = readOnly
    ? undefined
    : () => onBlur && onBlur();

  const numericValue = Number(value) || 0;
  const costNow = getCurrentCostPerPoint(rulesSpec, cost, numericValue);
  const costColor = getCostColor(costNow);
  const stepAmount = isSmallStep ? 1 : 5;
  const containerClass = ["cell", "stat-cell", className].filter(Boolean).join(" ");
  const charKey = CHARACTERISTIC_LABEL_TO_KEY[label] || label;
  const charDescription = CHARACTERISTIC_DESCRIPTIONS[charKey] || CHARACTERISTIC_DESCRIPTIONS[label];

  return (
    <div className={containerClass}>
      <div className="stat-row">
        <div className="stat-label">
          <Tooltip text={charDescription}>
            <span>{label}</span>
          </Tooltip>
        </div>
        <div className="label-extra">
          {base !== undefined && <strong className="no-print">{base}</strong>}
          {!readOnly && (costNow || costNow === 0) ? (
            <span className="no-print" style={{ color: costColor, fontWeight: "bold" }}> Cost {costNow}</span>
          ) : ""}
        </div>
        <div className="stat-input-row">
          {!readOnly && onDelta && (
            <div className="xp-buttons step-buttons">
              <button
                type="button"
                className="step-button"
                style={{ background: costColor, color: getCostTextColor(costNow) }}
                onClick={() => onDelta(-stepAmount)}
              >
                -{stepAmount}
              </button>
              <button
                type="button"
                className="step-button"
                style={{ background: costColor, color: getCostTextColor(costNow) }}
                onClick={() => onDelta(+stepAmount)}
              >
                +{stepAmount}
              </button>
            </div>
          )}
          <input
            type="number"
            min={0}
            max={90}
            value={Number(value) || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={readOnly}
            className="stat-box-input stat-box"
          />
        </div>
      </div>
    </div>
  );
}

function ReadSmall({ label, value, className = "" }) {
  const containerClass = ["cell", "read-small", className].filter(Boolean).join(" ");
  return (
    <div className={containerClass}>
      <div className="stat-row">
        <div className="stat-label">{label}</div>
        <input readOnly value={value} className="stat-box-input stat-box" />
      </div>
    </div>
  );
}

function TextCell({ label, value, onChange }) {
  return (
    <div className="cell text-cell">
      <div className="cell-label">{label}</div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-input line-input"
      />
    </div>
  );
}

// Action buttons component to be reused at top and bottom of the form
function ActionButtons({ 
  t, 
  mode, 
  isSubmitting, 
  handleSubmit, 
  handleDelete, 
  handleExportJSON, 
  handleSetAll,
  onCancel
}) {
  return (
    <div className="button-row" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "center" }}>
      <button
        type="button"
        className="button"
        style={{ background: "linear-gradient(135deg, #9a8f7e, #8b7d6b)", border: "2px solid #7a6a56", color: "#f5f3e8", padding: "0.6rem 1.2rem", fontWeight: "500" }}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Ana Sayfa
      </button>
      <button
        type="submit"
        className="button"
        style={{ background: "linear-gradient(135deg, #daa520, #b8860b)", border: "2px solid #b8860b", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(218, 165, 32, 0.3)", color: "#f5f3e8", padding: "0.6rem 1.2rem", fontWeight: "500" }}
        disabled={isSubmitting}
        onClick={(e) => handleSubmit(e, false)}
      >
        {isSubmitting ? "Kaydediliyor..." : t("playerForm.saveReturn")}
      </button>

      <button
        type="button"
        className="button"
        style={{ background: "linear-gradient(135deg, #b8860b, #9a7509)", border: "2px solid #9a7509", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(184, 134, 11, 0.3)", color: "#f5f3e8", padding: "0.6rem 1.2rem", fontWeight: "500" }}
        disabled={isSubmitting}
        onClick={(e) => handleSubmit(e, true)}
      >
        {isSubmitting ? "Kaydediliyor..." : t("playerForm.saveStay")}
      </button>

      <button
        type="button"
        className="button no-print"
        style={{ background: "linear-gradient(135deg, #7a6a56, #6d5d4b)", border: "2px solid #6d5d4b", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(122, 106, 86, 0.2)", color: "#f5f3e8", padding: "0.6rem 1.2rem", fontWeight: "500" }}
        onClick={() => window.print()}
      >
        {t("playerForm.print")}
      </button>

      <button
        type="button"
        className="button"
        style={{ background: "linear-gradient(135deg, #8b7d6b, #7a6a56)", border: "2px solid #7a6a56", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(122, 106, 86, 0.2)", color: "#f5f3e8", padding: "0.6rem 1.2rem", fontWeight: "500" }}
        onClick={handleExportJSON}
      >
        {t("playerForm.exportJson")}
      </button>

      {DEBUGMODE && (
        <>
          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #f5f3e8, #e8e4d0)", color: "#5a4a3a", border: "2px solid #d4d0b8" }}
            onClick={() => handleSetAll(10)}
          >
            All 10
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #e8e4d0, #dbdabd)", color: "#5a4a3a", border: "2px solid #c5c1a8" }}
            onClick={() => handleSetAll(15)}
          >
            All 15
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #dbdabd, #d4d0b8)", color: "#3e3a2f", border: "2px solid #b8b5a0" }}
            onClick={() => handleSetAll(20)}
          >
            All 20
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #c5c1a8, #b8b5a0)", color: "#3e3a2f", border: "2px solid #a89f8d" }}
            onClick={() => handleSetAll(25)}
          >
            All 25
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #a89f8d, #9a8f7e)", color: "#f5f3e8", border: "2px solid #8b7d6b" }}
            onClick={() => handleSetAll(30)}
          >
            All 30
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #8b7d6b, #7a6a56)", color: "#f5f3e8", border: "2px solid #6d5d4b" }}
            onClick={() => handleSetAll(35)}
          >
            All 35
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #6d5d4b, #5a4a3a)", color: "#f5f3e8", border: "2px solid #4d3f30" }}
            onClick={() => handleSetAll(40)}
          >
            All 40
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #5a4a3a, #4d3f30)", color: "#f5f3e8", border: "2px solid #3e3228" }}
            onClick={() => handleSetAll(45)}
          >
            All 45
          </button>

          <button
            type="button"
            className="button"
            style={{ background: "linear-gradient(135deg, #4d3f30, #3e3228)", color: "#f5f3e8", border: "2px solid #2f2620" }}
            onClick={() => handleSetAll(50)}
          >
            All 50
          </button>
        </>
      )}

      {mode !== "create" && (
        <button
          type="button"
          className="button"
          style={{ background: "linear-gradient(135deg, #c45a5a, #a84848)", color: "#fff5f5", border: "2px solid #a84848", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(196, 90, 90, 0.2)", padding: "0.6rem 1.2rem", fontWeight: "500" }}
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {t("playerForm.delete")}
        </button>
      )}
    </div>
  );
}

// Custom Alert Modal Component
function CustomAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: "linear-gradient(135deg, #e8e4d0, #dbdabd)",
          border: "3px solid #8b7d6b",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "450px",
          minWidth: "300px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(218, 165, 32, 0.1)",
          animation: "slideIn 0.3s ease-out",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          fontSize: "1.1rem",
          color: "#3e3a2f",
          marginBottom: "1.5rem",
          lineHeight: "1.6",
          fontFamily: "'Georgia', 'Garamond', serif",
          textAlign: "center"
        }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #daa520, #b8860b)",
            border: "2px solid #b8860b",
            borderRadius: "6px",
            color: "#f5f3e8",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(218, 165, 32, 0.3)",
            fontFamily: "'Georgia', 'Garamond', serif"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.4), 0 0 25px rgba(218, 165, 32, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(218, 165, 32, 0.3)";
          }}
        >
          Tamam
        </button>
      </div>
    </div>
  );
}

function PlayerForm({ mode = "create", player = null, onCancel, onCreated, onUpdated }) {
  const [rulesSpec, setRulesSpec] = useState(null);
  const [rulesLoading, setRulesLoading] = useState(true);
  const { offlineMode, setOfflineMode, enqueueRequest } = useConnectivity();
  const [form, setForm] = useState(() => getInitialForm(null, mode, player));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();

  const avatarSrc = resolveAvatarSrc(form);
  const hasAvatar = Boolean(form.avatar || form.avatarLink);

  const handleSetAll = (value) => {
    if (!rulesSpec) return;
    const keys = [
      "APP", "BONUS", "BRV", "CON", "AGI", "EDU", "INT", "LUCK",
      "SENSE", "SPOT", "WILL", "SAN", "SIZ", "ARMOR", "RES", "STR"
    ];
    setForm((prev) => {
      const next = { ...prev };
      for (const k of keys) {
        next[k] = clampStat(rulesSpec, value, k);
      }
      // Also set all numeric skills to the target value
      for (const def of FIELD_DEFS) {
        if (def.type === "number") {
          next[def.key] = clampStat(rulesSpec, value, def.key);
        }
      }
      return applyDerived(rulesSpec, next);
    });
  };

  const queuePlayerRequest = (method, url, payload, token, playerId) => {
    // If player was offline-created (timestamp ID > 1000000000), always POST to backend
    const isOfflineCreated = player?._isOfflineCreated || (playerId && playerId > 1000000000);
    const finalMethod = (method === "PUT" && isOfflineCreated) ? "POST" : method;
    const finalUrl = (finalMethod === "POST") ? `${API_BASE_URL}/players` : url;
    
    enqueueRequest({
      method: finalMethod,
      url: finalUrl,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  };

  // Load rules spec from localStorage (App.js loads from backend on startup)
  useEffect(() => {
    const fallbackSpec = createFallbackRulesSpec();
    try {
      setRulesLoading(true);
      
      // Try cached rules first
      const cachedRaw = localStorage.getItem(RULES_CACHE_KEY);
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          if (cached?.spec) {
            console.log("[PlayerForm] Using rules spec from cache");
            setRulesSpec(cached.spec);
            setForm(getInitialForm(cached.spec, mode, player));
            setRulesLoading(false);
            return;
          }
        } catch (parseErr) {
          console.warn("[PlayerForm] Failed to parse cached rules", parseErr);
          localStorage.removeItem(RULES_CACHE_KEY);
        }
      }

      // If no cache, use fallback
      console.log("[PlayerForm] Using fallback rules spec");
      setRulesSpec(fallbackSpec);
      setForm(getInitialForm(fallbackSpec, mode, player));
      setRulesLoading(false);
    } catch (err) {
      console.error("[PlayerForm] Rules initialization error:", err.message);
      setRulesSpec(fallbackSpec);
      setForm(getInitialForm(fallbackSpec, mode, player));
      setRulesLoading(false);
    }
  }, [mode, player]);

  const handleNumericChange = (name, rawValue) => {
    setForm((prev) => ({ ...prev, [name]: rawValue }));
  };

  const handleNumericBlur = (name) => {
    setForm((prev) => {
      const clamped = clampStat(rulesSpec, prev[name], name);
      return applyDerived(rulesSpec, { ...prev, [name]: clamped });
    });
  };

  const handleTextChange = (name, value) => {
    setForm((prev) => applyDerived(rulesSpec, { ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Avatar en fazla 1MB olabilir.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result || "";
      const base64 = String(result).split(",")[1] || "";
      setForm((prev) => ({ ...prev, avatar: base64, avatarLink: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelta = (field, delta) => {
    setForm((prev) => {
      const current = Number(prev[field]) || 0;
      let next;
      
      if (delta > 0) {
        next = (Math.floor(current / 5) + 1) * 5;
      } else {
        next = Math.max(0, (Math.floor(current / 5) - 1) * 5);
      }
      
      const clamped = clampStat(rulesSpec, next, field);
      return applyDerived(rulesSpec, { ...prev, [field]: clamped });
    });
  };

  const handleExportJSON = () => {
    const { avatar, id, ...exportData } = form;
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.name || "character"}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e, stayOnPage = false) => {
    e.preventDefault();
    
    // Check if player is readonly
    if (player?.readonly) {
      setAlertMessage("Bu oyuncu salt okunurdur. Güncelleme yapılamaz.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const useBackend = !offlineMode;

      const payload = { ...form };

      // Sayısal alanları clamp'le
      Object.keys(payload).forEach((k) => {
        if (FIELD_DEFS.find((d) => d.key === k && d.type === "number")) {
          let n = Number(payload[k]) || 0;
          if (n < 0) n = 0;
          if (n > 90) n = 90;
          payload[k] = n;
        }
      });

      // Backend entity uses CON/DEX instead of STA/AGI
      // Ensure payload includes these mapped values to avoid XP mismatches
      payload.CON = Number(payload.STA) || 0;
      payload.DEX = Number(payload.AGI) || 0;

      let response;

      // Detect offline-created players: they should be POSTed to backend, not PUT
      const isOfflineCreated = player?._isOfflineCreated || (player?.id && player.id > 1000000000);
      const shouldPost = mode === "create" || isOfflineCreated;
      
      const url = shouldPost
        ? `${API_BASE_URL}/players`
        : `${API_BASE_URL}/players/${player.id}`;
      const method = shouldPost ? "POST" : "PUT";

      if (!useBackend) {
        const saved = saveOfflinePlayer(payload, mode, player);
        queuePlayerRequest(method, url, payload, token, saved.id);
        if (mode === "create") {
          onCreated && onCreated(saved, { stay: stayOnPage });
        } else {
          onUpdated && onUpdated(saved, { stay: stayOnPage });
        }
      } else if (shouldPost) {
        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Player oluşturulamadı.");
        }

        const created = await response.json();
        onCreated && onCreated(created, { stay: stayOnPage });
      } else {
        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Player güncellenemedi.");
        }

        const updated = await response.json();
        onUpdated && onUpdated(updated, { stay: stayOnPage });
      }

      if (!stayOnPage && onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error(err);
      if (!offlineMode) {
        // Network failure while online: fall back to offline save + queue
        try {
          const token = localStorage.getItem("token");
          const isOfflineCreated = player?._isOfflineCreated || (player?.id && player.id > 1000000000);
          const shouldPost = mode === "create" || isOfflineCreated;
          const url = shouldPost
            ? `${API_BASE_URL}/players`
            : `${API_BASE_URL}/players/${player?.id}`;
          const method = shouldPost ? "POST" : "PUT";
          const saved = saveOfflinePlayer({ ...form }, mode, player);
          queuePlayerRequest(method, url, { ...form }, token, saved.id);
          setOfflineMode(true);
          setAlertMessage("Offline kaydedildi, bağlantı gelince senkronize edilecek.");
          if (mode === "create") {
            onCreated && onCreated(saved, { stay: stayOnPage });
          } else {
            onUpdated && onUpdated(saved, { stay: stayOnPage });
          }
        } catch (fallbackErr) {
          console.error("[PlayerForm] Offline fallback failed", fallbackErr);
          setError(err.message || "Bir hata oluştu.");
        }
      } else {
        setError(err.message || "Bir hata oluştu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!player || !player.id) return;
    
    // Check if player is readonly
    if (player?.readonly) {
      setAlertMessage("Bu oyuncu salt okunurdur. Silme işlemi yapılamaz.");
      return;
    }
    
    const confirmed = window.confirm("Bu oyuncuyu silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const useBackend = !offlineMode;
      const isOfflineCreated = player?._isOfflineCreated || (player?.id && player.id > 1000000000);
      const url = `${API_BASE_URL}/players/${player.id}`;

      if (!useBackend) {
        deleteOfflinePlayer(player.id);
        // Only queue DELETE if player exists on backend
        if (!isOfflineCreated) {
          enqueueRequest({
            method: "DELETE",
            url,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        }
        if (onCancel) onCancel();
        return;
      }

      // If offline-created, just delete locally (doesn't exist on backend)
      if (isOfflineCreated) {
        deleteOfflinePlayer(player.id);
        if (onCancel) onCancel();
        return;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Player silinemedi.");
      }

      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      try {
        const token = localStorage.getItem("token");
        const isOfflineCreated = player?._isOfflineCreated || (player?.id && player.id > 1000000000);
        const url = `${API_BASE_URL}/players/${player.id}`;
        deleteOfflinePlayer(player.id);
        // Only queue DELETE if player exists on backend
        if (!isOfflineCreated) {
          enqueueRequest({
            method: "DELETE",
            url,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        }
        setOfflineMode(true);
        setAlertMessage("Offline silindi, bağlantı gelince silme kuyruğa alındı.");
        if (onCancel) onCancel();
      } catch (fallbackErr) {
        console.error("[PlayerForm] Offline delete fallback failed", fallbackErr);
        setError(err.message || "Silme işlemi sırasında hata oluştu.");
      }
    }
  };

  // Show loading state while rules are being fetched
  if (rulesLoading) {
    return (
      <div className="page-wrapper">
        <div className="player-page">
          <div className="loading-block" style={{ color: "#b8860b", textShadow: "0 0 10px rgba(218, 165, 32, 0.3)" }}>
            <p>{t("playerForm.rulesLoading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
      {isSubmitting && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            textAlign: "center",
            color: "white"
          }}>
            <div style={{
              fontSize: "2rem",
              marginBottom: "1rem"
            }}>⏳</div>
            <div style={{
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>{t("common.saving")}</div>
          </div>
        </div>
      )}
      <div className="main-container">
        <div
          className="sheet-page player-page"
          style={{
            "--frame-horizontal": `url(${frameHorizontalShort})`,
            "--frame-vertical": `url(${frameVertical})`,
            "--frame-vertical-short": `url(${frameVerticalShort})`,
            "--corner-tl": `url(${cornerTL})`,
            "--corner-tr": `url(${cornerTR})`,
            "--corner-bl": `url(${cornerBL})`,
            "--corner-br": `url(${cornerBR})`,
          }}
        >
          {/* Decorative frame elements */}
          <div className="coc-frame frame-top" aria-hidden="true"></div>
          <div className="coc-frame frame-left" aria-hidden="true"></div>
          <div className="coc-frame frame-right" aria-hidden="true"></div>
          <div className="coc-frame frame-bottom" aria-hidden="true"></div>
          {/* Corner signs */}
          <div className="coc-corner corner-tl" aria-hidden="true"></div>
          <div className="coc-corner corner-tr" aria-hidden="true"></div>
          <div className="coc-corner corner-bl" aria-hidden="true"></div>
          <div className="coc-corner corner-br" aria-hidden="true"></div>
          {hasAvatar && (
            <img
              src={avatarSrc}
              alt=""
              className="print-bg-image"
              aria-hidden="true"
            />
          )}
          
          <div className="no-print toolbar-row">
            <LanguageSwitcher variant="compact" />
          </div>

          {offlineMode && (
            <div className="error print-hide" style={{ margin: "0 0 1rem 0", background: "linear-gradient(135deg, #d4d0b8, #c5c1a8)", border: "2px solid #8b7d6b", boxShadow: "0 0 15px rgba(139, 125, 107, 0.2)", color: "#3e3a2f" }}>
              {t("playerForm.offlineMessage")}
            </div>
          )}
          
          {/* Action buttons at the top */}
          <div className="no-print" style={{ marginBottom: "1.5rem" }}>
            <ActionButtons 
              t={t}
              mode={mode}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              handleExportJSON={handleExportJSON}
              handleSetAll={handleSetAll}
              onCancel={onCancel}
            />
          </div>
          
          <div className="sheet-header header-grid">
            {/* Row 1 */}
            <TextCell label="Player" value={form.player} onChange={(v) => handleTextChange("player", v)} />
            <TextCell label="Name" value={form.name} onChange={(v) => handleTextChange("name", v)} />
            <TextCell label="Birthplace" value={form.birthPlace} onChange={(v) => handleTextChange("birthPlace", v)} />

            {/* Avatar */}
            <div className="avatarCol avatar-col">
              <div className="avatarBox avatar-box" onClick={() => document.getElementById('avatar-upload').click()}>
                <img
                  src={avatarSrc}
                  alt={form.name || "avatar"}
                  className="avatar-img"
                />
              </div>
              <input
                id="avatar-upload"
                className="no-print avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Row 2: Pronoun and Age in same div */}
            <div className="cell pronoun-age-cell">
              <div className="pronoun-age-inner">
                <div className="pronoun-input">
                  <div className="cell-label">Pronoun</div>
                  <input
                    type="text"
                    value={form.pronoun || ""}
                    onChange={(e) => handleTextChange("pronoun", e.target.value)}
                    className="text-input line-input"
                  />
                </div>
                <div className="age-wrapper">
                  <div className="cell-label">Age</div>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={form.age || 0}
                    onChange={(e) => handleNumericChange("age", e.target.value)}
                    className="age-input line-input"
                  />
                </div>
              </div>
            </div>
            <TextCell label="Residence" value={form.residence} onChange={(v) => handleTextChange("residence", v)} />

            {/* Row 3 */}
            <TextCell label="Occupation" value={form.occupation} onChange={(v) => handleTextChange("occupation", v)} />

            {/* Characteristics from rulesSpec */}
            <StatCell rulesSpec={rulesSpec} label="Strength" value={form.STR} base={rulesSpec.base.STR} cost={rulesSpec.cost.STR} onChange={(v) => handleNumericChange("STR", v)} onBlur={() => handleNumericBlur("STR")} onDelta={(d) => handleDelta("STR", d)} />
            <StatCell rulesSpec={rulesSpec} label="Size" value={form.SIZ} base={rulesSpec.base.SIZ} cost={rulesSpec.cost.SIZ} onChange={(v) => handleNumericChange("SIZ", v)} onBlur={() => handleNumericBlur("SIZ")} onDelta={(d) => handleDelta("SIZ", d)} />
            <ReadSmall label="Hit Points" value={form.HP ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Stamina" value={form.STA} base={rulesSpec.base.STA} cost={rulesSpec.cost.STA} onChange={(v) => handleNumericChange("STA", v)} onBlur={() => handleNumericBlur("STA")} onDelta={(d) => handleDelta("STA", d)} />
            <StatCell rulesSpec={rulesSpec} label="Will" value={form.WILL} base={rulesSpec.base.WILL} cost={rulesSpec.cost.WILL} onChange={(v) => handleNumericChange("WILL", v)} onBlur={() => handleNumericBlur("WILL")} onDelta={(d) => handleDelta("WILL", d)} />
            <ReadSmall label="Magic Points" value={form.MP ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Agility" value={form.AGI} base={rulesSpec.base.AGI} cost={rulesSpec.cost.AGI} onChange={(v) => handleNumericChange("AGI", v)} onBlur={() => handleNumericBlur("AGI")} onDelta={(d) => handleDelta("AGI", d)} />
            <StatCell rulesSpec={rulesSpec} label="Education" value={form.EDU} base={rulesSpec.base.EDU} cost={rulesSpec.cost.EDU} onChange={(v) => handleNumericChange("EDU", v)} onBlur={() => handleNumericBlur("EDU")} onDelta={(d) => handleDelta("EDU", d)} />
            <StatCell rulesSpec={rulesSpec} label="Luck" value={form.LUCK} base={rulesSpec.base.LUCK} cost={rulesSpec.cost.LUCK} onChange={(v) => handleNumericChange("LUCK", v)} onBlur={() => handleNumericBlur("LUCK")} onDelta={(d) => handleDelta("LUCK", d)} />

            <StatCell rulesSpec={rulesSpec} label="Intellect" value={form.INT} base={rulesSpec.base.INT} cost={rulesSpec.cost.INT} onChange={(v) => handleNumericChange("INT", v)} onBlur={() => handleNumericBlur("INT")} onDelta={(d) => handleDelta("INT", d)} />
            <StatCell rulesSpec={rulesSpec} label="Appearance" value={form.APP} base={rulesSpec.base.APP} cost={rulesSpec.cost.APP} onChange={(v) => handleNumericChange("APP", v)} onBlur={() => handleNumericBlur("APP")} onDelta={(d) => handleDelta("APP", d)} />
            <StatCell rulesSpec={rulesSpec} label="Bonus" value={form.BONUS} base={rulesSpec.base.BONUS} cost={rulesSpec.cost.BONUS} onChange={(v) => handleNumericChange("BONUS", v)} onBlur={() => handleNumericBlur("BONUS")} onDelta={(d) => handleDelta("BONUS", d)} />
            
            <StatCell rulesSpec={rulesSpec} label="Spot Hidden" value={form.SPOT} base={rulesSpec.base.SPOT} cost={rulesSpec.cost.SPOT} onChange={(v) => handleNumericChange("SPOT", v)} onBlur={() => handleNumericBlur("SPOT")} onDelta={(d) => handleDelta("SPOT", d)} />
            <StatCell rulesSpec={rulesSpec} label="Sense" value={form.SENSE} base={rulesSpec.base.SENSE} cost={rulesSpec.cost.SENSE} onChange={(v) => handleNumericChange("SENSE", v)} onBlur={() => handleNumericBlur("SENSE")} onDelta={(d) => handleDelta("SENSE", d)} />
            <StatCell rulesSpec={rulesSpec} label="Sanity" value={form.SAN} base={rulesSpec.base.SAN} cost={rulesSpec.cost.SAN} onChange={(v) => handleNumericChange("SAN", v)} onBlur={() => handleNumericBlur("SAN")} onDelta={(d) => handleDelta("SAN", d)} />
            <ReadSmall label="Build" value={form.Build ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Bravery" value={form.BRV} base={rulesSpec.base.BRV} cost={rulesSpec.cost.BRV} onChange={(v) => handleNumericChange("BRV", v)} onBlur={() => handleNumericBlur("BRV")} onDelta={(d) => handleDelta("BRV", d)} />
            <ReadSmall label="Move" value={form.MOVE ?? 8} />
            <ReadSmall label="Damage Add" value={form.damageBonus ?? "0"} />
            <StatCell
              rulesSpec={rulesSpec}
              label="Armor"
              value={form.ARMOR}
              base={rulesSpec.base.ARMOR}
              cost={rulesSpec.cost.ARMOR}
              onChange={(v) => handleNumericChange("ARMOR", v)}
              onBlur={() => handleNumericBlur("ARMOR")}
              onDelta={(d) => handleDelta("ARMOR", d)}
              isSmallStep={true}
              className={(Number(form.ARMOR) || 0) === 0 ? "print-hide" : ""}
            />
            <StatCell
              rulesSpec={rulesSpec}
              label="Resiliance"
              value={form.RES}
              base={rulesSpec.base.RES}
              cost={rulesSpec.cost.RES}
              onChange={(v) => handleNumericChange("RES", v)}
              onBlur={() => handleNumericBlur("RES")}
              onDelta={(d) => handleDelta("RES", d)}
              isSmallStep={true}
              className={(Number(form.RES) || 0) === 0 ? "print-hide" : ""}
            />
            <ReadSmall label="Used XP" value={form.usedXP ?? 0} className="print-hide" />
            <ReadSmall label="Level" value={form.level ?? 0} />
          </div>
          <form onSubmit={(e) => handleSubmit(e, false)} className="player-form">
            <div className="sheet-grid">
              {FIELD_DEFS.map((def) => {
                // Map frontend keys to backend keys
                const skillKeyMap = {
                  "AnimalHandling": "Animal Handling",
                  "ArtCraft": "Art Craft",
                  "ArtCraft2": "Art Craft 2",
                  "Artillery": "Artillery",
                  "ComputerUse": "Computer Use",
                  "CreditRating": "Credit Rating",
                  "CthulhuMythos": "Cthulhu Mythos",
                  "Deception": "Deception",
                  "Demolitions": "Demolitions",
                  "DriveAuto": "Drive Auto",
                  "Electronics": "Electronics",
                  "ElectricalRepair": "Electrical Repair",
                  "FastTalk": "Fast Talk",
                  "FightingBrawl": "Fighting Brawl",
                  "FightingOther": "Fighting Other",
                  "FirearmsHandgun": "Firearms Handgun",
                  "FirearmsOther": "Firearms Other",
                  "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
                  "FirstAid": "First Aid",
                  "Hypnosis": "Hypnosis",
                  "LanguageOther1": "Language Other 1",
                  "LanguageOther2": "Language Other 2",
                  "LanguageOther3": "Language Other 3",
                  "LanguageOwn": "Language Own",
                  "LibraryUse": "Library Use",
                  "MechanicalRepair": "Mechanical Repair",
                  "NaturalWorld": "Natural World",
                  "OperateHeavyMachinery": "Operate Heavy Machinery",
                  "ReadLips": "Read Lips",
                  "ScienceOther": "Science Other",
                  "ScienceOther2": "Science Other 2",
                  "SignLanguage": "Sign Language",
                  "SleightOfHand": "Sleight Of Hand",
                  "UncommonLanguage": "Uncommon Language",
                  "Other1": "Other1",
                  "Other2": "Other2",
                  "Other3": "Other3"
                };
                
                const backendKey = skillKeyMap[def.key] || def.key;
                const value = form[def.key] ?? "";
                const base = rulesSpec.base[backendKey];
                const cost = rulesSpec.cost[backendKey];
                const isNumber = def.type === "number";
                const labelWithBase = base !== undefined ? `${def.label} ${base}` : def.label;

                const numericValue = Number(value) || 0;
                const currentCost = getCurrentCostPerPoint(rulesSpec, cost, numericValue);
                const totalCost = isNumber && cost !== undefined ? getCostBetween(rulesSpec, backendKey, base ?? 0, numericValue) : 0;
                const costColor = getCostColor(currentCost);
                // Removed native titles; show cost via labelExtra

                const labelExtra =
                  isNumber && (cost !== undefined)
                    ? ` (Cost: ${currentCost})`
                    : "";
                const halfValue = Math.floor(numericValue / 2);
                const fifthValue = Math.floor(numericValue / 5);

                const baseValue = Number(base ?? 0);
                const gain = numericValue - baseValue;
                const hideForSmallGain = gain < 4;
                const hideForLowValue = numericValue < 9;

                // Keep must-have skills visible in print regardless of value
                const isMustHave = MUST_HAVE_SKILLS.has(def.key);
                const hideInPrint = !isMustHave && (hideForSmallGain || hideForLowValue);

                const containerClass = [hideInPrint ? "print-hide" : "", "field"].filter(Boolean).join(" ");

                return (
                  <div key={def.key} className={containerClass}>
                    <div className="field-header"> 
                      <span className="label-text flex-1">
                          <Tooltip text={SKILL_DESCRIPTIONS[def.key]}>
                            <span>{def.label}</span>
                          </Tooltip>
                          {" "}<strong className="no-print">{labelWithBase.split(" ").pop()}</strong>
                        {labelExtra && (
                          <span className="label-extra no-print" style={{ color: costColor, fontWeight: "bold" }}>{labelExtra}</span>
                        )}
                      </span>

                      <div className="value-row">
                        {isNumber && (
                          <div className="xp-buttons step-buttons">
                            <button
                              type="button"
                              className="step-button"
                              style={{ background: costColor, color: getCostTextColor(currentCost) }}
                              onClick={() => handleDelta(def.key, -5)}
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              className="step-button"
                              style={{ background: costColor, color: getCostTextColor(currentCost) }}
                              onClick={() => handleDelta(def.key, +5)}
                            >
                              +5
                            </button>
                          </div>
                        )}

                        <input
                          type={def.type}
                          name={def.key}
                          value={def.type === "number" && numericValue === 0 ? "" : value}
                          style={{ textAlign: "center" }}
                          onChange={(e) =>
                            def.type === "number"
                              ? handleNumericChange(def.key, e.target.value)
                              : handleTextChange(def.key, e.target.value)
                          }
                          onBlur={def.type === "number" ? () => handleNumericBlur(def.key) : undefined}
                          max={def.type === "number" ? 90 : undefined}
                          className="input-inline"
                          placeholder={def.type === "number" && numericValue === 0 ? "0" : undefined}
                        />

                        <input
                          readOnly
                          value={halfValue}
                          className="input-inline-readonly"
                          aria-label={`${def.label} half value`}
                        />

                        <input
                          readOnly
                          value={fifthValue}
                          className="input-inline-readonly-small"
                          aria-label={`${def.label} fifth value`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <div className="error">{error}</div>}

            {/* Notes section */}
            <div id="notes" className="notes-section">
              <div className="notes-header">Notes</div>
              <textarea
                name="notes"
                value={form.notes ?? ""}
                onChange={(e) => handleTextChange("notes", e.target.value)}
                className="notes-area"
                placeholder="Add your notes here..."
              />
            </div>

            {/* Background questions */}
            <div id="background" className="background-section">
              <div className="background-grid">
                {BACKGROUND_ROWS.map((row, rowIdx) => (
                  <div key={`bg-row-${rowIdx}`} className="background-row">
                    {row.map((cell) => (
                      <div key={cell.key} className="background-cell">
                        <div className="background-label">{cell.label}</div>
                        <textarea
                          name={cell.key}
                          value={form[cell.key] ?? ""}
                          onChange={(e) => handleTextChange(cell.key, e.target.value)}
                          className="background-area"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="update-buttons no-print buttons-bar">
              <ActionButtons 
                t={t}
                mode={mode}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                handleDelete={handleDelete}
                handleExportJSON={handleExportJSON}
                handleSetAll={handleSetAll}
                onCancel={onCancel}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerForm;
