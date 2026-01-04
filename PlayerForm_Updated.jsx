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

// Debug mode kontrolü - All X butonlarını göstermek için true yapın
const DEBUGMODE = false;

/**
 * Updated PlayerForm.jsx to use backend RulesSpec with multi-level penalties
 * Loads rules from GET /api/rules instead of hardcoding them
 * Supports 5 penalty levels: 40(1.5x), 50(2x), 60(3x), 70(4x), 80(6x)
 */

const RULES_CACHE_KEY = "rulesCache";
const RULES_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const FIELD_DEFS = [
  { key: "Accounting", label: "Accounting", type: "number" },
  { key: "AnimalHandling", label: "Animal Handling", type: "number" },
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
  { key: "CthulhuMythos", label: "Cthulhu Mythos", type: "number" },
  { key: "Demolitions", label: "Demolitions", type: "number" },
  { key: "Disguise", label: "Disguise", type: "number" },
  { key: "Dodge", label: "Dodge", type: "number" },
  { key: "DriveAuto", label: "Drive (Auto)", type: "number" },
  { key: "Electronics", label: "Electronics", type: "number" },
  { key: "ElectricalRepair", label: "Electrical Repair", type: "number" },
  { key: "FastTalk", label: "Fast Talk", type: "number" },
  { key: "FightingBrawl", label: "Fighting Brawl", type: "number" },
  { key: "FightingOther", label: "FO (___________)", type: "number" },
  { key: "FirearmsHandgun", label: "Handgun", type: "number" },
  { key: "FirearmsOther", label: "FA-O (___________)", type: "number" },
  { key: "FirearmsRifleShotgun", label: "Firearms Shotgun", type: "number" },
  { key: "FirstAid", label: "First Aid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Hypnosis", label: "Hypnosis", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "LO1 (___________)", type: "number" },
  { key: "LanguageOther2", label: "LO2 (___________)", type: "number" },
  { key: "LanguageOther3", label: "LO3 (___________)", type: "number" },
  { key: "LanguageOwn", label: "Language", type: "number" },
  { key: "Law", label: "Law", type: "number" },
  { key: "LibraryUse", label: "Library Use", type: "number" },
  { key: "Listen", label: "Listen", type: "number" },
  { key: "Locksmith", label: "Locksmith", type: "number" },
  { key: "MechanicalRepair", label: "Mechanical Repair", type: "number" },
  { key: "Medicine", label: "Medicine", type: "number" },
  { key: "NaturalWorld", label: "Natural World", type: "number" },
  { key: "Navigate", label: "Navigate", type: "number" },
  { key: "Occult", label: "Occult", type: "number" },
  { key: "OperateHeavyMachinery", label: "Operate Heavy Machinery", type: "number" },
  { key: "Persuade", label: "Persuade", type: "number" },
  { key: "Pilot", label: "Pilot", type: "number" },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number" },
  { key: "Psychology", label: "Psychology", type: "number" },
  { key: "ReadLips", label: "Read Lips", type: "number" },
  { key: "Ride", label: "Ride", type: "number" },
  { key: "Science", label: "Science", type: "number" },
  { key: "ScienceOther", label: "SO (___________)", type: "number" },
  { key: "ScienceOther2", label: "SO2 (___________)", type: "number" },
  { key: "SignLanguage", label: "Sign Language", type: "number" },
  { key: "Deception", label: "Deception", type: "number" },
  { key: "SleightOfHand", label: "Sleight of Hand", type: "number" },
  { key: "Status", label: "Status", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
  { key: "UncommonLanguage", label: "Uncommon Language", type: "number" },
  { key: "Other1", label: "O1 (___________)", type: "number" },
  { key: "Other2", label: "O2 (___________)", type: "number" },
  { key: "Other3", label: "O3 (___________)", type: "number" },
];

// Skills that must always remain visible in print, regardless of value
const MUST_HAVE_SKILLS = new Set([
  "Climb",
  "CthulhuMythos",
  "Dodge",
  "LanguageOwn",
  "Listen",
  "Deception", // fallback if added later
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
    Deception: 10,
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
    Deception: 130,
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
      thresholds: [40, 50, 60, 70, 80],
      multipliers: [1.5, 2, 3, 4, 5],
    },
    levelRules: {
      baseXP: 100000,
      xpPerLevel: 10000,
    },
  };
}

// Cost değerine göre renk döndürür - Cthulhu teması: Yeşil tonları
function getCostColor(cost) {
  // Smooth gradient: Light Green → Green → Teal → Dark Green → Dark Teal → Purple → Dark Purple
  if (cost < 40) return "#a5d6a7";        // light green (1-39)
  if (cost < 80) return "#66bb6a";        // green (40-79)
  if (cost < 120) return "#4caf50";       // medium green (80-119)
  if (cost < 160) return "#388e3c";       // dark green (120-159)
  if (cost < 220) return "#2e7d32";       // darker green (160-219)
  if (cost < 300) return "#26a69a";       // teal (220-299)
  if (cost < 400) return "#00897b";       // dark teal (300-399)
  if (cost < 550) return "#00695c";       // darker teal (400-549)
  if (cost < 750) return "#004d40";       // darkest teal (550-749)
  if (cost < 1000) return "#1b5e20";      // forest green (750-999)
  if (cost < 1400) return "#7e57c2";      // purple (1000-1399)
  if (cost < 2000) return "#673ab7";      // dark purple (1400-1999)
  if (cost < 3000) return "#5e35b1";      // darker purple (2000-2999)
  if (cost < 4000) return "#512da8";      // darkest purple (3000-3999)
  if (cost < 5000) return "#311b92";      // deep purple (4000-4999)
  return "#1a237e";                       // indigo (5000+)
}

// Buton yazı rengi: Koyu yeşil tonları ve üzeri için açık, altı için koyu
function getCostTextColor(cost) {
  return cost >= 300 ? "#e0e7d5" : "#0d1e15";
}

/**
 * Belirli bir değerde 1 puan artırmanın maliyeti (multi-level threshold penaltileriyle)
 * Supports 5 penalty levels: 40->1.5x, 50->2x, 60->3x, 70->4x, 80->6x
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
    "Deception": "Deception",
    "SleightOfHand": "Sleight Of Hand",
    "Status": "STATUS",
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
    "Deception": "Deception",
    "Status": "STATUS",
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
    "Deception": "Deception",
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
    const record = { ...payload, id: Date.now() };
    const next = [...list, record];
    localStorage.setItem(key, JSON.stringify(next));
    return record;
  }

  const next = list.map((p) => (p.id === player.id ? { ...payload, id: player.id } : p));
  localStorage.setItem(key, JSON.stringify(next));
  return { ...payload, id: player.id };
}

function deleteOfflinePlayer(id) {
  const key = "offlinePlayers";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const next = list.filter((p) => p.id !== id);
  localStorage.setItem(key, JSON.stringify(next));
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
  const tooltipText = `${costNow * stepAmount} XP`;
  const containerClass = ["cell", "stat-cell", className].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <div className="stat-row">
        <div className="stat-label">{label}</div>
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
                title={tooltipText}
                onClick={() => onDelta(-stepAmount)}
              >
                -{stepAmount}
              </button>
              <button
                type="button"
                className="step-button"
                style={{ background: costColor, color: getCostTextColor(costNow) }}
                title={tooltipText}
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

function PlayerForm({ mode = "create", player = null, onCancel, onCreated, onUpdated }) {
  const [rulesSpec, setRulesSpec] = useState(null);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [form, setForm] = useState(() => getInitialForm(null, mode, player));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Load rules spec from backend on mount
  useEffect(() => {
    const loadRulesSpec = async () => {
      const fallbackSpec = createFallbackRulesSpec();
      try {
        setRulesLoading(true);
        // Try cached rules first (10 min TTL)
        const cachedRaw = localStorage.getItem(RULES_CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            const isFresh = cached?.timestamp && cached?.spec && (Date.now() - cached.timestamp < RULES_CACHE_TTL_MS);
            if (isFresh) {
              console.log("[PlayerForm] Using cached rules spec");
              setRulesSpec(cached.spec);
              setOfflineMode(false);
              setForm(getInitialForm(cached.spec, mode, player));
              return;
            }
          } catch (parseErr) {
            console.warn("[PlayerForm] Failed to parse cached rules, clearing cache", parseErr);
            localStorage.removeItem(RULES_CACHE_KEY);
          }
        }

        console.log(`[PlayerForm] Backend URL: ${API_BASE_URL}`);
        const response = await fetch(`${API_BASE_URL}/players/rules`);
        console.log(`[PlayerForm] Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Rules specification yüklenemedi`);
        }
        const spec = await response.json();
        console.log("[PlayerForm] Rules loaded from backend");

        // Cache the fresh rules
        localStorage.setItem(RULES_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), spec }));

        setRulesSpec(spec);
        setOfflineMode(false);
        
        // Initialize form with loaded spec
        setForm(getInitialForm(spec, mode, player));
      } catch (err) {
        console.error("[PlayerForm] Rules yükleme hatası:", err.message);
        console.error("[PlayerForm] Full error:", err);
        localStorage.removeItem(RULES_CACHE_KEY);
        setOfflineMode(true);
        setRulesError("Sunucuya ulaşılamadı, varsayılan kurallar kullanılıyor.");
        setRulesSpec(fallbackSpec);
        setForm(getInitialForm(fallbackSpec, mode, player));
      } finally {
        setRulesLoading(false);
      }
    };
    
    loadRulesSpec();
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

      if (!useBackend) {
        const saved = saveOfflinePlayer(payload, mode, player);
        if (mode === "create") {
          onCreated && onCreated(saved, { stay: stayOnPage });
        } else {
          onUpdated && onUpdated(saved, { stay: stayOnPage });
        }
      } else if (mode === "create") {
        response = await fetch(`${API_BASE_URL}/players`, {
          method: "POST",
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
        response = await fetch(`${API_BASE_URL}/players/${player.id}`, {
          method: "PUT",
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
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!player || !player.id) return;
    const confirmed = window.confirm("Bu oyuncuyu silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const useBackend = !offlineMode;

      if (!useBackend) {
        deleteOfflinePlayer(player.id);
        if (onCancel) onCancel();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/players/${player.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Player silinemedi.");
      }

      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      setError(err.message || "Silme işlemi sırasında hata oluştu.");
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
            <div className="error" style={{ margin: "0 0 1rem 0", background: "linear-gradient(135deg, #d4d0b8, #c5c1a8)", border: "2px solid #8b7d6b", boxShadow: "0 0 15px rgba(139, 125, 107, 0.2)", color: "#3e3a2f" }}>
              {t("playerForm.offlineMessage")}
            </div>
          )}

          {rulesError && !offlineMode && (
            <div className="error" style={{ margin: "0 0 1rem 0" }}>
              <p><strong>{t("playerForm.rulesErrorTitle")}:</strong> {rulesError}</p>
            </div>
          )}
          
          <div className="sheet-header header-grid">
            {/* Row 1 */}
            <TextCell label="Player" value={form.player} onChange={(v) => handleTextChange("player", v)} />
            <TextCell label="Name" value={form.name} onChange={(v) => handleTextChange("name", v)} />
            <TextCell label="Birthplace" value={form.birthPlace} onChange={(v) => handleTextChange("birthPlace", v)} />

            {/* Avatar */}
            <div className="avatarCol avatar-col">
              <div className="avatarBox avatar-box" onClick={() => document.getElementById('avatar-upload').click()} title={t("playerForm.uploadImageTooltip")}>
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
                  "Deception": "Deception",
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
                const tooltipText = isNumber && cost !== undefined ? `Spent: ${totalCost}` : "";
                const deltaTooltipText = `${currentCost * 5} XP`;

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
                    <div className="field-header" title={tooltipText}> 
                      <span className="label-text flex-1">
                        {def.label} <strong className="no-print">{labelWithBase.split(" ").pop()}</strong>
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
                              title={deltaTooltipText}
                              onClick={() => handleDelta(def.key, -5)}
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              className="step-button"
                              style={{ background: costColor, color: getCostTextColor(currentCost) }}
                              title={deltaTooltipText}
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
              <button
                type="button"
                className="button"
                style={{ background: "linear-gradient(135deg, #9a8f7e, #8b7d6b)", border: "2px solid #7a6a56", color: "#f5f3e8" }}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t("playerForm.back")}
              </button>

              <button
                type="submit"
                className="button"
                style={{ background: "linear-gradient(135deg, #daa520, #b8860b)", border: "2px solid #b8860b", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(218, 165, 32, 0.3)", color: "#f5f3e8" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, false)}
              >
                {isSubmitting ? "Kaydediliyor..." : t("playerForm.saveReturn")}
              </button>

              <button
                type="button"
                className="button"
                style={{ background: "linear-gradient(135deg, #b8860b, #9a7509)", border: "2px solid #9a7509", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(184, 134, 11, 0.3)", color: "#f5f3e8" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, true)}
              >
                {isSubmitting ? "Kaydediliyor..." : t("playerForm.saveStay")}
              </button>

            
              <button
                type="button"
                className="button no-print"
                style={{ background: "linear-gradient(135deg, #7a6a56, #6d5d4b)", border: "2px solid #6d5d4b", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(122, 106, 86, 0.2)", color: "#f5f3e8" }}
                onClick={() => window.print()}
              >
                {t("playerForm.print")}
              </button>
            

              <button
                type="button"
                className="button"
                style={{ background: "linear-gradient(135deg, #8b7d6b, #7a6a56)", border: "2px solid #7a6a56", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(122, 106, 86, 0.2)", color: "#f5f3e8" }}
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
                  style={{ background: "linear-gradient(135deg, #c45a5a, #a84848)", color: "#fff5f5", border: "2px solid #a84848", boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(196, 90, 90, 0.2)" }}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {t("playerForm.delete")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerForm;
