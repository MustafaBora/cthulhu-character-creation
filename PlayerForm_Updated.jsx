import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import defaultAvatar from "./assets/default-avatar.png";
import frameHorizontalShort from "./assets/horizontal-short.png";
import frameVertical from "./assets/vertical.png";
import frameVerticalShort from "./assets/vertical-short.png";
import cornerTL from "./assets/signs-1.png";
import cornerTR from "./assets/signs-2.png";
import cornerBL from "./assets/signs-3.png";
import cornerBR from "./assets/signs-4.png";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Updated PlayerForm.jsx to use backend RulesSpec with multi-level penalties
 * Loads rules from GET /api/rules instead of hardcoding them
 * Supports 5 penalty levels: 40(1.5x), 50(2x), 60(3x), 70(4x), 80(6x)
 */

const FIELD_DEFS = [
  { key: "Accounting", label: "Accounting", type: "number" },
  { key: "Anthropology", label: "Anthropology", type: "number" },
  { key: "Appraise", label: "Appraise", type: "number" },
  { key: "Archeology", label: "Archeology", type: "number" },
  { key: "ArtCraft", label: "Art/Craft", type: "number" },
  { key: "ArtCraft2", label: "Art/Craft 2", type: "number" },
  { key: "Charm", label: "Charm", type: "number" },
  { key: "Climb", label: "Climb", type: "number" },
  { key: "CreditRating", label: "Credit Rating", type: "number" },
  { key: "CthulhuMythos", label: "Cthulhu Mythos", type: "number" },
  { key: "Disguise", label: "Disguise", type: "number" },
  { key: "Dodge", label: "Dodge", type: "number" },
  { key: "DriveAuto", label: "Drive (Auto)", type: "number" },
  { key: "ElectricalRepair", label: "Electrical Repair", type: "number" },
  { key: "FastTalk", label: "Fast Talk", type: "number" },
  { key: "FightingBrawl", label: "Fighting (Brawl)", type: "number" },
  { key: "FightingOther", label: "FO", type: "number" },
  { key: "FirearmsHandgun", label: "Firearms Handgun", type: "number" },
  { key: "FirearmsOther", label: "FA-O", type: "number" },
  { key: "FirearmsRifleShotgun", label: "Firearms Shotgun", type: "number" },
  { key: "FirstAid", label: "First Aid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "LO1", type: "number" },
  { key: "LanguageOther2", label: "LO2", type: "number" },
  { key: "LanguageOther3", label: "LO3", type: "number" },
  { key: "LanguageOwn", label: "Language (Own)", type: "number" },
  { key: "Law", label: "Law", type: "number" },
  { key: "LibraryUse", label: "Library Use", type: "number" },
  { key: "Listen", label: "Listen", type: "number" },
  { key: "Locksmith", label: "Locksmith", type: "number" },
  { key: "MechanicalRepair", label: "Mechanical Repair", type: "number" },
  { key: "Medicine", label: "Medicine", type: "number" },
  { key: "NaturalWorld", label: "Natural World", type: "number" },
  { key: "Navigate", label: "Navigate", type: "number" },
  { key: "Occult", label: "Occult", type: "number" },
  { key: "Persuade", label: "Persuade", type: "number" },
  { key: "Pilot", label: "Pilot", type: "number" },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number" },
  { key: "Psychology", label: "Psychology", type: "number" },
  { key: "Ride", label: "Ride", type: "number" },
  { key: "Science", label: "Science", type: "number" },
  { key: "ScienceOther", label: "SO", type: "number" },
  { key: "ScienceOther2", label: "SO2", type: "number" },
  { key: "SleightOfHand", label: "Sleight of Hand", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
  { key: "Other1", label: "O1", type: "number" },
  { key: "Other2", label: "O2", type: "number" },
  { key: "Other3", label: "O3", type: "number" },
];

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

// Cost değerine göre renk döndürür
function getCostColor(cost) {
  // Daha geniş skala: ilk renk krem, son iki renk koyu gri ve siyah
  if (cost < 50) return "#dee3a7";       // krem (en ucuz)
  if (cost < 100) return "#a4dc76";      // lime
  if (cost < 150) return "#20b961";      // açık yeşil
  if (cost < 200) return "#72c53e";      // yeşil
  if (cost < 250) return "#aab318";      // sarı
  if (cost < 300) return "#f59e0b";      // amber
  if (cost < 400) return "#f97316";      // turuncu
  if (cost < 500) return "#ef4444";      // kırmızı
  if (cost < 600) return "#dc2626";      // koyu kırmızı
  if (cost < 800) return "#be123c";      // crimson
  if (cost < 1000) return "#9333ea";     // mor
  if (cost < 1500) return "#7c3aed";     // koyu mor
  if (cost < 2000) return "#581c87";     // çok koyu mor
  if (cost < 4000) return "#374151";     // koyu gri
  return "#000000";                      // siyah (en pahalı)
}

// Buton yazı rengi: kırmızı ve üzeri için beyaz, altı için siyah
function getCostTextColor(cost) {
  return cost >= 400 ? "#fff" : "#000";
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
        const currentMultiplier = (current >= threshold) ? multiplier : 1.0;
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
  
  console.log("=== XP Calculation Debug ===");
  let sum = 0;
  
  // Characteristics
  const characteristics = ["APP", "BONUS", "BRV", "STA", "AGI", "EDU", "INT", "LUCK", "SENSE", "SPOT", "WILL", "STATUS", "SAN", "SIZ", "ARMOR", "RES", "STR"];
  console.log("--- Characteristics ---");
  for (const key of characteristics) {
    const v = Number(values[key]) || 0;
    const baseValue = rulesSpec.base[key] ?? 0;
    const cost = getCostBetween(rulesSpec, key, baseValue, v);
    if (v > 0 || cost > 0) {
      console.log(`${key}: base=${baseValue}, value=${v}, cost=${cost}`);
    }
    sum += cost;
  }
  
  // Skills - using backend key names (with spaces)
  const skills = [
    "Accounting", "Anthropology", "Appraise", "Archeology", "Art Craft", "Art Craft 2",
    "Charm", "Climb", "Credit Rating", "Cthulhu Mythos", "Disguise", "Dodge",
    "Drive Auto", "Electrical Repair", "Fast Talk", "Fighting Brawl", "Fighting Other",
    "Firearms Handgun", "Firearms Other", "Firearms Rifle Shotgun",
    "First Aid", "History", "Intimidate", "Jump", "Language Other 1", "Language Other 2",
    "Language Other 3", "Language Own", "Law", "Library Use", "Listen", "Locksmith",
    "Mechanical Repair", "Medicine", "Natural World", "Navigate", "Occult", "Persuade",
    "Pilot", "Psychoanalysis", "Psychology", "Ride", "Science", "Science Other",
    "Science Other 2", "Sleight Of Hand", "Stealth", "Survival", "Swim", "Throw", "Track",
    "Other1", "Other2", "Other3"
  ];
  console.log("--- Skills ---");
  
  // Map frontend keys to backend keys for skills
  const skillKeyMap = {
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "DriveAuto": "Drive Auto",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SleightOfHand": "Sleight Of Hand",
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
    if (v > 0 || cost > 0) {
      console.log(`${frontendKey} (${backendKey}): base=${baseValue}, value=${v}, cost=${cost}`);
    }
    sum += cost;
  }
  
  console.log(`--- Total Used XP: ${sum} ---`);
  return sum;
}

function applyDerived(rulesSpec, values) {
  if (!rulesSpec) return values;
  
  const v = (k) => Number(values[k]) || 0;
  const updated = { ...values };

  updated.HP = Math.floor((v("STA") + v("SIZ")) / 10);
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
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "DriveAuto": "Drive Auto",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SleightOfHand": "Sleight Of Hand"
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

function getInitialForm(rulesSpec, mode, player) {
  if (!rulesSpec) return {};
  
  // Map frontend keys to backend keys
  const skillKeyMap = {
    "ArtCraft": "Art Craft",
    "ArtCraft2": "Art Craft 2",
    "CreditRating": "Credit Rating",
    "CthulhuMythos": "Cthulhu Mythos",
    "DriveAuto": "Drive Auto",
    "ElectricalRepair": "Electrical Repair",
    "FastTalk": "Fast Talk",
    "FightingBrawl": "Fighting Brawl",
    "FightingOther": "Fighting Other",
    "FirearmsHandgun": "Firearms Handgun",
    "FirearmsOther": "Firearms Other",
    "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
    "FirstAid": "First Aid",
    "LanguageOther1": "Language Other 1",
    "LanguageOther2": "Language Other 2",
    "LanguageOther3": "Language Other 3",
    "LanguageOwn": "Language Own",
    "LibraryUse": "Library Use",
    "MechanicalRepair": "Mechanical Repair",
    "NaturalWorld": "Natural World",
    "ScienceOther": "Science Other",
    "ScienceOther2": "Science Other 2",
    "SleightOfHand": "Sleight Of Hand"
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
      // Map backend CON/DEX to frontend STA/AGI for consistency in the UI
      STA: player?.CON ?? player?.STA ?? 0,
      AGI: player?.DEX ?? player?.AGI ?? 0,
      SENSE: player?.SENSE ?? player?.PER ?? 0,
      STATUS: player?.STATUS ?? player?.REP ?? 0,
      ARMOR: player?.ARMOR ?? player?.armor ?? 0,
      RES: player?.RES ?? player?.res ?? 0,
      avatar: player?.avatar || "",
    });

    // Ensure background fields exist even if backend doesn't have them
    BACKGROUND_KEYS.forEach((k) => {
      if (baseObj[k] === undefined) baseObj[k] = "";
    });

    return baseObj;
  }
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

  const containerClass = ["stat-cell", className].filter(Boolean).join(" ");

  return (
    <div style={styles.cell} className={containerClass}>
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.labelExtra}>
          {base !== undefined && <strong className="no-print">{base}</strong>}
          {!readOnly && (costNow || costNow === 0) ? (
            <span className="no-print" style={{ color: costColor, fontWeight: "bold" }}> Cost {costNow}</span>
          ) : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {!readOnly && onDelta && (
            <div className="xp-buttons" style={styles.stepButtons}>
              <button
                type="button"
                style={{ ...styles.stepButton, background: costColor, color: getCostTextColor(costNow) }}
                title={tooltipText}
                onClick={() => onDelta(-stepAmount)}
              >
                -{stepAmount}
              </button>
              <button
                type="button"
                style={{ ...styles.stepButton, background: costColor, color: getCostTextColor(costNow) }}
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
            className="stat-box-input"
            style={styles.statBox}
          />
        </div>
      </div>
    </div>
  );
}

function ReadSmall({ label, value, className = "" }) {
  const containerClass = ["read-small", className].filter(Boolean).join(" ");
  return (
    <div style={styles.cell} className={containerClass}>
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <input readOnly value={value} className="stat-box-input" style={styles.statBox} />
      </div>
    </div>
  );
}

function TextCell({ label, value, onChange }) {
  return (
    <div style={styles.cell} className="text-cell">
      <div style={styles.cellLabel}>{label}</div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-input"
        style={styles.lineInput}
      />
    </div>
  );
}

function PlayerForm({ mode = "create", player = null, onCancel, onCreated, onUpdated }) {
  const [rulesSpec, setRulesSpec] = useState(null);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState("");
  const [form, setForm] = useState(() => getInitialForm(null, mode, player));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSetAll = (value) => {
    if (!rulesSpec) return;
    const keys = [
      "APP", "BONUS", "BRV", "STA", "AGI", "EDU", "INT", "LUCK",
      "SENSE", "SPOT", "WILL", "STATUS", "SAN", "SIZ", "ARMOR", "RES", "STR"
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
      try {
        setRulesLoading(true);
        const response = await fetch("http://localhost:2999/players/rules");
        if (!response.ok) {
          throw new Error("Rules specification yüklenemedi");
        }
        const spec = await response.json();
        setRulesSpec(spec);
        
        // Initialize form with loaded spec
        setForm(getInitialForm(spec, mode, player));
      } catch (err) {
        console.error("Rules yükleme hatası:", err);
        setRulesError(err.message || "Rules yüklenirken bir hata oluştu");
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
      setForm((prev) => ({ ...prev, avatar: base64 }));
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
      if (!token) {
        setError("Token bulunamadı. Lütfen tekrar giriş yap.");
        setIsSubmitting(false);
        return;
      }

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

      if (mode === "create") {
        response = await fetch("http://localhost:2999/players", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Player oluşturulamadı.");
        }

        const created = await response.json();
        onCreated && onCreated(created, { stay: stayOnPage });
      } else {
        response = await fetch(`http://localhost:2999/players/${player.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      if (!token) {
        setError("Token bulunamadı. Lütfen tekrar giriş yap.");
        return;
      }

      const response = await fetch(`http://localhost:2999/players/${player.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <div style={styles.pageWrapper}>
        <div style={styles.page}>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>{t("playerForm.rulesLoading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if rules failed to load
  if (rulesError) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.page}>
          <div style={{ ...styles.error, margin: "2rem" }}>
            <p><strong>{t("playerForm.rulesErrorTitle")}:</strong> {rulesError}</p>
            <p>{t("playerForm.rulesErrorHint")}</p>
          </div>
          <button onClick={onCancel} style={{ ...styles.button, margin: "1rem", background: "#9ca3af" }}>
            {t("playerForm.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        /* CoC decorative frame */
        .sheet-page {
          position: relative;
          --frame-thickness: 28px;
        }
        .coc-frame {
          pointer-events: none;
        }
        .frame-top,
        .frame-bottom {
          position: absolute;
          left: 0;
          width: 100%;
          height: var(--frame-thickness);
          background-image: url(${frameHorizontalShort});
          background-repeat: repeat-x;
          background-size: auto 100%;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          z-index: 0;
        }
        .frame-top { top: 0; }
        .frame-bottom { bottom: 0; }
                /* Corner signs */
                .coc-corner {
                  position: absolute;
                  width: calc(var(--frame-thickness) * 3);
                  height: calc(var(--frame-thickness) * 3);
                  background-repeat: no-repeat;
                  background-size: contain;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  z-index: 1;
                }
                .corner-tl { top: 0; left: 0; background-image: url(${cornerTL}); }
                .corner-tr { top: 0; right: 0; background-image: url(${cornerTR}); }
                .corner-bl { bottom: 0; left: 0; background-image: url(${cornerBL}); }
                .corner-br { bottom: 0; right: 0; background-image: url(${cornerBR}); }
        .frame-left,
        .frame-right {
          position: absolute;
          top: var(--frame-thickness);
          height: calc(100% - (var(--frame-thickness) * 2));
          width: var(--frame-thickness);
          background-image: url(${frameVertical});
          background-repeat: repeat-y;
          background-size: 100% auto;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          z-index: 0;
        }
        .frame-left { left: 0; }
        .frame-right { right: 0; }

        /* Use short vertical for small screens */
        @media (max-height: 700px), (max-width: 640px) {
          .frame-left,
          .frame-right {
            background-image: url(${frameVerticalShort});
          }
        }

        /* Divider between characteristics and skills */
        .sheet-divider {
          position: relative;
          height: 1px;
          margin: 10px 0;
          background: linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.35), rgba(0,0,0,0.05));
          z-index: 2;
        }

        .print-bg-image {
          display: none;
        }

        @media print {
          @page { size: A4; margin: 8mm; }
          .sheet-page { padding: 0.75rem !important; position: relative !important; }
          /* Ensure frame prints */
          .frame-top,
          .frame-bottom,
          .frame-left,
          .frame-right {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            opacity: 1 !important;
            z-index: 0 !important;
          }
          /* Use short verticals on print to stay within A4 */
          .frame-left,
          .frame-right {
            background-image: url(${frameVerticalShort}) !important;
          }
          .coc-corner {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            opacity: 1 !important;
            z-index: 1 !important;
          }
          .frame-horizontal {
            z-index: 0 !important;
          }
          .frame-left,
          .frame-right {
            z-index: 0 !important;
          }
          .print-bg-image {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            opacity: 0.15 !important;
            z-index: 0 !important;
            filter: grayscale(100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .sheet-header, .sheet-grid, form {
            position: relative !important;
            z-index: 2 !important;
          }
          /* Keep avatar box transparent in print so PNG transparency is preserved */
          .avatarBox { background: transparent !important; }
          /* Make avatar column wrapper transparent in print */
          .avatarCol { background: transparent !important; border-color: rgba(0,0,0,0.18) !important; }
          /* Ensure divider prints clearly */
          .sheet-divider { background: rgba(0,0,0,0.35) !important; height: 1px !important; }
          .sheet-header { gap: 3px 4px !important; background: transparent !important; border: 1px solid #111 !important; border-radius: 8px !important; }
          .sheet-header .cell { padding: 2px 3px !important; background: transparent !important; border: 1px solid rgba(0,0,0,0.18) !important; }
          .sheet-header input { padding: 2px 3px !important; font-size: 10px !important; background: transparent !important; }
          .sheet-grid { gap: 0.5rem 0.9rem !important; background: transparent !important; border: 1px solid #111 !important; border-radius: 12px !important; margin: 12px !important; }
          .sheet-grid .field-header > span:first-child { padding-left: 5px !important; }
          .sheet-grid .field-header { gap: 0.28rem !important; }
          .sheet-grid .value-row { gap: 3px !important; }
          .xp-buttons { display: none !important; }
          .no-print { display: none !important; }
          .print-hide { display: none !important; }
          .label-extra { display: none !important; }
          .label-extra-hide-print { display: none !important; }
          strong { font-weight: normal !important; }
          .sheet-header .statRow { gap: 4px !important; }
          .sheet-header .statLabel { font-size: 9px !important; }
          .avatarImg { filter: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; z-index: 0 !important; position: relative !important; }
          .sheet-header input[type="number"],
          .sheet-header input[readOnly] {
            width: 48px !important;
            min-width: 42px !important;
            max-width: 52px !important;
            font-size: 9px !important;
            text-align: right !important;
            padding: 2px 3px !important;
            background: transparent !important;
          }
          .sheet-header .cell { padding: 2px 3px !important; }
          .sheet-header .statRow { justify-content: space-between !important; }
          .value-row { flex-wrap: wrap !important; max-width: 100% !important; justify-content: flex-start !important; gap: 3px !important; }
          .value-row input { width: 22px !important; min-width: 18px !important; text-align: right !important; font-size: 9px !important; padding: 2px 3px !important; background: transparent !important; }
          .stat-cell { background: transparent !important; }
          .read-small { background: transparent !important; }
          .stat-box-input { background: transparent !important; }
          .text-cell { background: transparent !important; }
          .text-input { background: transparent !important; }
          .age-cell { background: transparent !important; }
          .age-input { background: transparent !important; }
          .cell { background: transparent !important; }
          input[type="number"] { background: transparent !important; }
          input[readOnly] { background: transparent !important; }
          /* Hide scrollbars in print */
          ::-webkit-scrollbar { display: none !important; }
          body { scrollbar-width: none !important; }
        }
      `}</style>

      <div style={styles.mainContainer}>
        <div className="sheet-page" style={styles.page}>
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
          {form.avatar && (
            <img
              src={`data:image/*;base64,${form.avatar}`}
              alt=""
              className="print-bg-image"
              aria-hidden="true"
            />
          )}
          
          <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px", position: "relative", zIndex: 1 }}>
            <LanguageSwitcher variant="compact" />
          </div>
          
          <div className="sheet-header" style={styles.headerGrid}>
            {/* Row 1 */}
            <TextCell label="Player" value={form.player} onChange={(v) => handleTextChange("player", v)} />
            <TextCell label="Name" value={form.name} onChange={(v) => handleTextChange("name", v)} />
            <TextCell label="Birthplace" value={form.birthPlace} onChange={(v) => handleTextChange("birthPlace", v)} />

            {/* Avatar */}
            <div className="avatarCol" style={styles.avatarCol}>
              <div className="avatarBox" style={styles.avatarBox} onClick={() => document.getElementById('avatar-upload').click()} title={t("playerForm.uploadImageTooltip")}>
                <img
                  src={form.avatar ? `data:image/*;base64,${form.avatar}` : defaultAvatar}
                  alt={form.name || "avatar"}
                  style={styles.avatarImg}
                />
              </div>
              <input
                id="avatar-upload"
                className="no-print"
                style={styles.avatarInput}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Row 2: Pronoun and Age in same div */}
            <div style={{ ...styles.cell, background: "transparent" }} className="pronoun-age-cell">
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={styles.cellLabel}>Pronoun</div>
                  <input
                    type="text"
                    value={form.pronoun || ""}
                    onChange={(e) => handleTextChange("pronoun", e.target.value)}
                    className="text-input"
                    style={styles.lineInput}
                  />
                </div>
                <div style={{ flex: "0 0 60px" }}>
                  <div style={styles.cellLabel}>Age</div>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={form.age || 0}
                    onChange={(e) => handleNumericChange("age", e.target.value)}
                    className="age-input"
                    style={styles.lineInput}
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
            <StatCell rulesSpec={rulesSpec} label="Appeal" value={form.APP} base={rulesSpec.base.APP} cost={rulesSpec.cost.APP} onChange={(v) => handleNumericChange("APP", v)} onBlur={() => handleNumericBlur("APP")} onDelta={(d) => handleDelta("APP", d)} />
            <StatCell rulesSpec={rulesSpec} label="Bonus" value={form.BONUS} base={rulesSpec.base.BONUS} cost={rulesSpec.cost.BONUS} onChange={(v) => handleNumericChange("BONUS", v)} onBlur={() => handleNumericBlur("BONUS")} onDelta={(d) => handleDelta("BONUS", d)} />
            
            <StatCell rulesSpec={rulesSpec} label="Spot Hidden" value={form.SPOT} base={rulesSpec.base.SPOT} cost={rulesSpec.cost.SPOT} onChange={(v) => handleNumericChange("SPOT", v)} onBlur={() => handleNumericBlur("SPOT")} onDelta={(d) => handleDelta("SPOT", d)} />
            <StatCell rulesSpec={rulesSpec} label="Sense" value={form.SENSE} base={rulesSpec.base.SENSE} cost={rulesSpec.cost.SENSE} onChange={(v) => handleNumericChange("SENSE", v)} onBlur={() => handleNumericBlur("SENSE")} onDelta={(d) => handleDelta("SENSE", d)} />
            <StatCell rulesSpec={rulesSpec} label="Sanity" value={form.SAN} base={rulesSpec.base.SAN} cost={rulesSpec.cost.SAN} onChange={(v) => handleNumericChange("SAN", v)} onBlur={() => handleNumericBlur("SAN")} onDelta={(d) => handleDelta("SAN", d)} />
            <ReadSmall label="Build" value={form.Build ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Status" value={form.STATUS} base={rulesSpec.base.STATUS} cost={rulesSpec.cost.STATUS} onChange={(v) => handleNumericChange("STATUS", v)} onBlur={() => handleNumericBlur("STATUS")} onDelta={(d) => handleDelta("STATUS", d)} />
            <StatCell rulesSpec={rulesSpec} label="Bravery" value={form.BRV} base={rulesSpec.base.BRV} cost={rulesSpec.cost.BRV} onChange={(v) => handleNumericChange("BRV", v)} onBlur={() => handleNumericBlur("BRV")} onDelta={(d) => handleDelta("BRV", d)} />
            <ReadSmall label="Move" value={form.MOVE ?? 8} />
            <ReadSmall label="Damage Bonus" value={form.damageBonus ?? "0"} />
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
            <ReadSmall label="Total XP" value={form.totalXP ?? 0} className="print-hide" />
            <ReadSmall label="Used XP" value={form.usedXP ?? 0} className="print-hide" />
            <ReadSmall label="Level" value={form.level ?? 0} />
          </div>
          <form onSubmit={(e) => handleSubmit(e, false)} style={styles.form}>
            <div className="sheet-grid" style={styles.grid}>
              {FIELD_DEFS.map((def) => {
                // Map frontend keys to backend keys
                const skillKeyMap = {
                  "ArtCraft": "Art Craft",
                  "ArtCraft2": "Art Craft 2",
                  "CreditRating": "Credit Rating",
                  "CthulhuMythos": "Cthulhu Mythos",
                  "DriveAuto": "Drive Auto",
                  "ElectricalRepair": "Electrical Repair",
                  "FastTalk": "Fast Talk",
                  "FightingBrawl": "Fighting Brawl",
                  "FightingOther": "Fighting Other",
                  "FirearmsHandgun": "Firearms Handgun",
                  "FirearmsOther": "Firearms Other",
                  "FirearmsRifleShotgun": "Firearms Rifle Shotgun",
                  "FirstAid": "First Aid",
                  "LanguageOther1": "Language Other 1",
                  "LanguageOther2": "Language Other 2",
                  "LanguageOther3": "Language Other 3",
                  "LanguageOwn": "Language Own",
                  "LibraryUse": "Library Use",
                  "MechanicalRepair": "Mechanical Repair",
                  "NaturalWorld": "Natural World",
                  "ScienceOther": "Science Other",
                  "ScienceOther2": "Science Other 2",
                  "SleightOfHand": "Sleight Of Hand",
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

                const isOther = def.key.toLowerCase().includes("other");
                const hideInPrint = isOther && base !== undefined && numericValue === Number(base);
                const isCthulhuMythos = def.key === "CthulhuMythos";
                const hideSkillInPrint = !isCthulhuMythos && numericValue <= 10 && numericValue > 0;
                const containerClass = (hideInPrint || hideSkillInPrint) ? "print-hide" : "";

                return (
                  <div key={def.key} style={styles.field} className={containerClass}>
                    <div className="field-header" style={styles.fieldHeader} title={tooltipText}> 
                      <span style={{ ...styles.labelText, flex: 1 }}>
                        {def.label} <strong className="no-print">{labelWithBase.split(" ").pop()}</strong>
                        {labelExtra && (
                          <span className="label-extra no-print" style={{ ...styles.labelExtra, color: costColor, fontWeight: "bold" }}>{labelExtra}</span>
                        )}
                      </span>

                      <div className="value-row" style={styles.valueRow}>
                        {isNumber && (
                          <div className="xp-buttons" style={styles.stepButtons}>
                            <button
                              type="button"
                              style={{ ...styles.stepButton, background: costColor, color: getCostTextColor(currentCost) }}
                              title={deltaTooltipText}
                              onClick={() => handleDelta(def.key, -5)}
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              style={{ ...styles.stepButton, background: costColor, color: getCostTextColor(currentCost) }}
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
                          onChange={(e) =>
                            def.type === "number"
                              ? handleNumericChange(def.key, e.target.value)
                              : handleTextChange(def.key, e.target.value)
                          }
                          onBlur={def.type === "number" ? () => handleNumericBlur(def.key) : undefined}
                          max={def.type === "number" ? 90 : undefined}
                          style={styles.inputInline}
                          placeholder={def.type === "number" && numericValue === 0 ? "0" : undefined}
                        />

                        <input
                          readOnly
                          value={halfValue}
                          style={styles.inputInlineReadOnly}
                          aria-label={`${def.label} half value`}
                        />

                        <input
                          readOnly
                          value={fifthValue}
                          style={styles.inputInlineReadOnlySmall}
                          aria-label={`${def.label} fifth value`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {/* Background questions */}
            <div id="background" style={styles.backgroundSection}>
              <div style={styles.backgroundGrid}>
                {BACKGROUND_ROWS.map((row, rowIdx) => (
                  <div key={`bg-row-${rowIdx}`} style={styles.backgroundRow}>
                    {row.map((cell) => (
                      <div key={cell.key} style={styles.backgroundCell}>
                        <div style={styles.backgroundLabel}>{cell.label}</div>
                        <textarea
                          name={cell.key}
                          value={form[cell.key] ?? ""}
                          onChange={(e) => handleTextChange(cell.key, e.target.value)}
                          style={styles.backgroundArea}
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="update-buttons no-print" style={styles.buttonsBar}>
              <button
                type="button"
                style={{ ...styles.button, background: "#9ca3af" }}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t("playerForm.back")}
              </button>

              <button
                type="submit"
                style={{ ...styles.button, background: "#fbbf24" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, false)}
              >
                {t("playerForm.saveReturn")}
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#22c55e" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, true)}
              >
                {t("playerForm.saveStay")}
              </button>

              {mode === "create" && (
                <button
                  type="button"
                  style={{ ...styles.button, background: "#0ea5e9" }}
                  onClick={() => window.print()}
                >
                  {t("playerForm.print")}
                </button>
              )}

              <button
                type="button"
                style={{ ...styles.button, background: "#8b5cf6" }}
                onClick={handleExportJSON}
              >
                {t("playerForm.exportJson")}
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#fafafa", color: "#000" }}
                onClick={() => handleSetAll(10)}
              >
                All 10
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#f5f5f5", color: "#000" }}
                onClick={() => handleSetAll(15)}
              >
                All 15
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#eeeeee", color: "#000" }}
                onClick={() => handleSetAll(20)}
              >
                All 20
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#e0e0e0", color: "#000" }}
                onClick={() => handleSetAll(25)}
              >
                All 25
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#d1d5db", color: "#000" }}
                onClick={() => handleSetAll(30)}
              >
                All 30
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#9ca3af", color: "#000" }}
                onClick={() => handleSetAll(35)}
              >
                All 35
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#6b7280", color: "#fff" }}
                onClick={() => handleSetAll(40)}
              >
                All 40
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#374151", color: "#fff" }}
                onClick={() => handleSetAll(45)}
              >
                All 45
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#1f2937", color: "#fff" }}
                onClick={() => handleSetAll(50)}
              >
                All 50
              </button>

              {mode !== "create" && (
                <button
                  type="button"
                  style={{ ...styles.button, background: "#ef4444", color: "#fff" }}
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

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    paddingBottom: "10px",
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    position: "relative",
    gap: 0,
    margin: "0 auto",
    width: "100%",
    maxWidth: "100%",
    alignItems: "stretch",
  },
  page: {
    flex: 1,
    padding: "1.5rem",
    background: "#ffffff",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#111827",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  avatarCol: {
    gridColumn: 4,
    gridRow: "1 / span 6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "start",
    gap: "6px",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "8px",
    padding: "8px",
    background: "#fff",
  },
  avatarBox: {
    width: "182px",
    height: "238px",
    border: "2px solid #111",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    textAlign: "center",
  },
  avatarInput: {
    display: "none",
  },
  form: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "0.6rem 1rem",
    background: "#ffffffff",
    borderRadius: "0.75rem",
    border: "1px solid #000000ff",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.12rem",
    fontSize: "0.75rem",
    position: "relative",
  },
  fieldHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.24rem",
    marginTop: "1px",
    marginLeft: "10px",
    marginRight: "10px",
  },
  labelText: {
    color: "#4b5563",
  },
  labelExtra: {
    paddingLeft: "4px",
    color: "#6b7280",
    fontSize: "0.75rem",
  },
  inputInline: {
    padding: "0.13rem 0.18rem",
    borderRadius: "0.28rem",
    border: "1px solid #000000ff",
    background: "#ffffffff",
    color: "#111827",
    fontSize: "0.76rem",
    boxSizing: "border-box",
    width: "32px",
    minWidth: "28px",
    maxWidth: "40px",
    textAlign: "right",
  },
  inputInlineReadOnly: {
    padding: "0.11rem 0.16rem",
    borderRadius: "0.28rem",
    border: "1px solid #d1d5db",
    background: "#f3f4f6",
    color: "#6b7280",
    fontSize: "0.74rem",
    boxSizing: "border-box",
    width: "24px",
    minWidth: "20px",
    maxWidth: "32px",
    textAlign: "right",
  },
  inputInlineReadOnlySmall: {
    padding: "0.10rem 0.14rem",
    borderRadius: "0.28rem",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    color: "#6b7280",
    fontSize: "0.72rem",
    boxSizing: "border-box",
    width: "20px",
    minWidth: "18px",
    maxWidth: "28px",
    textAlign: "right",
  },
  valueRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.1rem",
    flexShrink: 0,
    justifyContent: "flex-end",
    minWidth: 0,
    flexBasis: "45%",
    maxWidth: "48%",
    flexWrap: "wrap",
    marginLeft: "auto",
  },
  stepButtons: {
    display: "flex",
    flexDirection: "row",
    gap: "0.2rem",
    position: "relative",
    zIndex: 2,
  },
  stepButton: {
    padding: "0.08rem 0.3rem",
    borderRadius: "0.35rem",
    border: "1px solid #78350f",
    background: "#facc15",
    color: "#451a03",
    fontSize: "0.62rem",
    cursor: "pointer",
  },
  error: {
    background: "#7f1d1d",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    color: "#fecaca",
    fontSize: "0.8rem",
  },
  buttonsBar: {
    position: "sticky",
    bottom: 0,
    marginTop: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
    background: "linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0))",
    paddingTop: "0.5rem",
    paddingBottom: "0.25rem",
    position: "relative",
    zIndex: 2,
  },
  button: {
    padding: "0.45rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    color: "#111827",
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 2fr 3fr",
    gridAutoRows: "minmax(25px, auto)",
    gap: "4px 5px",
    border: "1px solid #111",
    borderRadius: "8px",
    padding: "8px",
    margin: "15px",
    marginBottom: "12px",
    alignItems: "stretch",
  },
  cell: {
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "4px",
    padding: "3px 4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
    background: "#fff",
  },
  cellLabel: {
    fontSize: "10px",
    marginBottom: "2px",
    color: "#111",
  },
  lineInput: {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #111",
    outline: "none",
    padding: "2px 2px",
    fontSize: "12px",
    background: "transparent",
    boxSizing: "border-box",
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  statLabel: {
    fontWeight: 800,
    letterSpacing: "0.3px",
    fontSize: "11px",
  },
  statBox: {
    width: "70px",
    height: "24px",
    border: "1px solid #111",
    borderRadius: "3px",
    textAlign: "center",
    fontSize: "12px",
    background: "#fff",
  },
  backgroundSection: {
    margin: "4px 8px 6px 8px",
    padding: "6px 8px",
    border: "1px solid #111",
    borderRadius: "8px",
    background: "transparent",
  },
  backgroundGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "4px",
  },
  backgroundRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "4px",
  },
  backgroundCell: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  backgroundLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#111",
  },
  backgroundArea: {
    width: "100%",
    minHeight: "52px",
    resize: "vertical",
    border: "1px solid #111",
    borderRadius: "6px",
    padding: "4px 6px",
    fontSize: "12px",
    fontFamily: "inherit",
    background: "transparent",
    boxSizing: "border-box",
  },
};

export default PlayerForm;
