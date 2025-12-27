import { useEffect, useState } from "react";

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
  { key: "FightingOther", label: "Fighting (Other)", type: "number" },
  { key: "FirearmsHandgun", label: "Firearms (Handgun)", type: "number" },
  { key: "FirearmsOther", label: "Firearms (Other)", type: "number" },
  { key: "FirearmsRifleShotgun", label: "Firearms (Shotgun)", type: "number" },
  { key: "FirstAid", label: "First Aid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "Language (Other 1)", type: "number" },
  { key: "LanguageOther2", label: "Language (Other 2)", type: "number" },
  { key: "LanguageOther3", label: "Language (Other 3)", type: "number" },
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
  { key: "ScienceOther", label: "Science (Other)", type: "number" },
  { key: "ScienceOther2", label: "Science (Other 2)", type: "number" },
  { key: "SleightOfHand", label: "Sleight of Hand", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
];

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
function getCurrentCostPerPoint(rulesSpec, usage, value) {
  if (!rulesSpec || !rulesSpec.penaltyRules) return 0;
  if (usage === undefined || usage === null) return 0;
  
  const { thresholds, multipliers } = rulesSpec.penaltyRules;
  
  if (!thresholds || !multipliers || thresholds.length === 0) return usage;
  
  // Find which multiplier applies to current value
  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i]) {
      // Check if we're in this bracket or a higher one
      if (i === thresholds.length - 1 || value < thresholds[i + 1]) {
        return usage * multipliers[i];
      }
    }
  }
  
  return usage; // Before first threshold: base cost (1x multiplier)
}

/**
 * Belirli bir seviyeye ulaşmak için gereken toplam puanı hesaplar.
 * Updated to use rulesSpec from backend with multi-level penalties
 */
function getCostBetween(rulesSpec, skill, currentValue, targetValue) {
  if (!rulesSpec) return 0;
  
  const usage = rulesSpec.usage[skill] ?? 0;
  const { thresholds, multipliers } = rulesSpec.penaltyRules;

  // Hiç iyileştirme yoksa maliyet sıfır
  if (targetValue <= currentValue || usage === 0) {
    return 0;
  }

  if (!thresholds || !multipliers || thresholds.length === 0) {
    // No penalty system, just linear cost
    return (targetValue - currentValue) * usage;
  }

  let totalCost = 0;
  let current = currentValue;

  // Process each threshold level
  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    const multiplier = multipliers[i];
    
    if (current >= threshold) {
      // Already past this threshold, continue
      continue;
    }
    
    if (current < threshold && current < targetValue) {
      // We haven't reached this threshold yet
      const nextThreshold = (i + 1 < thresholds.length) ? thresholds[i + 1] : Infinity;
      let end = Math.min(targetValue, nextThreshold);
      
      // Cost from current to this threshold (or to target if target is before threshold)
      if (current < threshold) {
        end = Math.min(end, threshold);
      }
      
      const diff = end - current;
      if (diff > 0) {
        totalCost += diff * usage; // Before threshold: base multiplier (1x)
        current = end;
      }
    }
  }
  
  // Cost for anything above the last threshold
  if (current < targetValue) {
    const lastMultiplier = multipliers[multipliers.length - 1];
    const diff = targetValue - current;
    totalCost += diff * usage * lastMultiplier;
  }

  return totalCost;
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
  const characteristics = ["APP", "BONUS", "BRV", "STA", "AGI", "EDU", "INT", "LUCK", "PER", "SPOT", "POW", "REP", "SAN", "SIZ", "ARMOR", "RES", "STR"];
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
  
  // Skills
  const skills = [
    "Accounting", "Anthropology", "Appraise", "Archeology", "ArtCraft", "ArtCraft2",
    "Charm", "Climb", "CreditRating", "CthulhuMythos", "Disguise", "Dodge",
    "DriveAuto", "ElectricalRepair", "FastTalk", "FightingBrawl", "FightingOther",
    "FirearmsHandgun", "FirearmsOther", "FirearmsRifleShotgun",
    "FirstAid", "History", "Intimidate", "Jump", "LanguageOther1", "LanguageOther2",
    "LanguageOther3", "LanguageOwn", "Law", "LibraryUse", "Listen", "Locksmith",
    "MechanicalRepair", "Medicine", "NaturalWorld", "Navigate", "Occult", "Persuade",
    "Pilot", "Psychoanalysis", "Psychology", "Ride", "Science", "ScienceOther",
    "ScienceOther2", "SleightOfHand", "Stealth", "Survival", "Swim", "Throw", "Track"
  ];
  console.log("--- Skills ---");
  for (const key of skills) {
    const v = Number(values[key]) || 0;
    const baseValue = rulesSpec.base[key] ?? 0;
    const cost = getCostBetween(rulesSpec, key, baseValue, v);
    if (v > 0 || cost > 0) {
      console.log(`${key}: base=${baseValue}, value=${v}, cost=${cost}`);
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
  updated.MP = Math.floor(v("POW") / 5);

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

  return updated;
}

function clampStat(rulesSpec, num, fieldName) {
  if (!rulesSpec) return num;
  
  let n = Number(num) || 0;
  const minValue = rulesSpec.base[fieldName] ? rulesSpec.base[fieldName] : 0;
  if (n < minValue) n = minValue;
  // ARMOR ve RES için max 1, diğerleri için max 90
  const maxValue = (fieldName === 'ARMOR' || fieldName === 'RES') ? 1 : 90;
  if (n > maxValue) n = maxValue;
  return n;
}

function getInitialForm(rulesSpec, mode, player) {
  if (!rulesSpec) return {};
  
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
      Build: 0,
      damageBonus: "0",
      MP: 0,
      HP: 0,
      MOVE: 8,
      ARMOR: 0,
      RES: 0,
      avatar: "",
    };

    // Karakteristikler ve beceriler için BASE değerlerini başlangıç olarak ayarla
    for (const key of Object.keys(rulesSpec.base)) {
      obj[key] = rulesSpec.base[key] ?? obj[key];
    }

    for (const def of FIELD_DEFS) {
      if (def.type === "number") {
        obj[def.key] = rulesSpec.base[def.key] ?? 0;
      } else {
        obj[def.key] = "";
      }
    }

    return applyDerived(rulesSpec, obj);
  } else {
    // Edit modu
    return applyDerived(rulesSpec, {
      ...player,
      ARMOR: player?.ARMOR ?? player?.armor ?? 0,
      RES: player?.RES ?? player?.res ?? 0,
      avatar: player.avatar || "",
    });
  }
}

function StatCell({ rulesSpec, label, value, onChange, onBlur, onDelta, base, usage, readOnly = false, isSmallStep = false }) {
  const handleChange = readOnly
    ? undefined
    : (e) => onChange && onChange(e.target.value);

  const handleBlur = readOnly
    ? undefined
    : () => onBlur && onBlur();

  const numericValue = Number(value) || 0;
  const costNow = getCurrentCostPerPoint(rulesSpec, usage, numericValue);
  const costColor = getCostColor(costNow);
  const stepAmount = isSmallStep ? 1 : 5;
  const tooltipText = `${costNow * stepAmount} XP`;

  return (
    <div style={styles.cell} className="stat-cell">
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

function ReadSmall({ label, value }) {
  return (
    <div style={styles.cell} className="read-small">
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

  // Load rules spec from backend on mount
  useEffect(() => {
    const loadRulesSpec = async () => {
      try {
        setRulesLoading(true);
        const response = await fetch("http://localhost:8080/players/rules");
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

      let response;

      if (mode === "create") {
        response = await fetch("http://localhost:8080/players", {
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
        onCreated && onCreated(created);
      } else {
        response = await fetch(`http://localhost:8080/players/${player.id}`, {
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
        onUpdated && onUpdated(updated);
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

  // Show loading state while rules are being fetched
  if (rulesLoading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.page}>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Rules yükleniyor...</p>
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
            <p><strong>Hata:</strong> {rulesError}</p>
            <p>Sunucunun çalışır durumda olduğundan emin olun.</p>
          </div>
          <button onClick={onCancel} style={{ ...styles.button, margin: "1rem", background: "#9ca3af" }}>
            Geri dön
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

        .print-bg-image {
          display: none;
        }

        @media print {
          @page { size: A4; margin: 8mm; }
          .sheet-page { padding: 0.75rem !important; position: relative !important; }
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
            z-index: 1 !important;
          }
          .sheet-header { gap: 3px 4px !important; background: transparent !important; border: none !important; }
          .sheet-header .cell { padding: 2px 3px !important; background: transparent !important; border: 1px solid rgba(0,0,0,0.18) !important; }
          .sheet-header input { padding: 2px 3px !important; font-size: 10px !important; background: transparent !important; }
          .sheet-grid { gap: 0.5rem 0.9rem !important; background: transparent !important; border: none !important; }
          .sheet-grid .field-header > span:first-child { padding-left: 5px !important; }
          .sheet-grid .field-header { gap: 0.28rem !important; }
          .sheet-grid .value-row { gap: 3px !important; }
          .xp-buttons { display: none !important; }
          .no-print { display: none !important; }
          .label-extra { display: none !important; }
          .label-extra-hide-print { display: none !important; }
          strong { font-weight: normal !important; }
          .sheet-header .statRow { gap: 4px !important; }
          .sheet-header .statLabel { font-size: 9px !important; }
          .avatarImg { filter: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
        }
      `}</style>

      <div style={styles.mainContainer}>
        <div className="sheet-page" style={styles.page}>
          {form.avatar && (
            <img
              src={`data:image/*;base64,${form.avatar}`}
              alt=""
              className="print-bg-image"
              aria-hidden="true"
            />
          )}
          
          <div className="sheet-header" style={styles.headerGrid}>
            {/* Row 1 */}
            <TextCell label="Name" value={form.name} onChange={(v) => handleTextChange("name", v)} />
            <TextCell label="Birthplace" value={form.birthPlace} onChange={(v) => handleTextChange("birthPlace", v)} />
            <TextCell label="Pronoun" value={form.pronoun} onChange={(v) => handleTextChange("pronoun", v)} />

            {/* Avatar */}
            <div style={styles.avatarCol}>
              <div style={styles.avatarBox} onClick={() => document.getElementById('avatar-upload').click()}>
                {form.avatar ? (
                  <img
                    src={`data:image/*;base64,${form.avatar}`}
                    alt={form.name || "avatar"}
                    style={styles.avatarImg}
                  />
                ) : (
                  <div style={styles.avatarPlaceholder}>Resim Yükle</div>
                )}
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

            {/* Row 2 */}
            <TextCell label="Occupation" value={form.occupation} onChange={(v) => handleTextChange("occupation", v)} />
            <TextCell label="Residence" value={form.residence} onChange={(v) => handleTextChange("residence", v)} />
            <div style={styles.cell} className="age-cell">
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

            {/* Characteristics from rulesSpec */}
            <StatCell rulesSpec={rulesSpec} label="Strength" value={form.STR} base={rulesSpec.base.STR} usage={rulesSpec.usage.STR} onChange={(v) => handleNumericChange("STR", v)} onBlur={() => handleNumericBlur("STR")} onDelta={(d) => handleDelta("STR", d)} />
            <StatCell rulesSpec={rulesSpec} label="SIZE" value={form.SIZ} base={rulesSpec.base.SIZ} usage={rulesSpec.usage.SIZ} onChange={(v) => handleNumericChange("SIZ", v)} onBlur={() => handleNumericBlur("SIZ")} onDelta={(d) => handleDelta("SIZ", d)} />
            <ReadSmall label="Hit Points" value={form.HP ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Stamina" value={form.STA} base={rulesSpec.base.STA} usage={rulesSpec.usage.STA} onChange={(v) => handleNumericChange("STA", v)} onBlur={() => handleNumericBlur("STA")} onDelta={(d) => handleDelta("STA", d)} />
            <StatCell rulesSpec={rulesSpec} label="POW" value={form.POW} base={rulesSpec.base.POW} usage={rulesSpec.usage.POW} onChange={(v) => handleNumericChange("POW", v)} onBlur={() => handleNumericBlur("POW")} onDelta={(d) => handleDelta("POW", d)} />
            <ReadSmall label="Magic Points" value={form.MP ?? 0} />

            <StatCell rulesSpec={rulesSpec} label="Agility" value={form.AGI} base={rulesSpec.base.AGI} usage={rulesSpec.usage.AGI} onChange={(v) => handleNumericChange("AGI", v)} onBlur={() => handleNumericBlur("AGI")} onDelta={(d) => handleDelta("AGI", d)} />
            <StatCell rulesSpec={rulesSpec} label="Education" value={form.EDU} base={rulesSpec.base.EDU} usage={rulesSpec.usage.EDU} onChange={(v) => handleNumericChange("EDU", v)} onBlur={() => handleNumericBlur("EDU")} onDelta={(d) => handleDelta("EDU", d)} />
            <StatCell rulesSpec={rulesSpec} label="Luck" value={form.LUCK} base={rulesSpec.base.LUCK} usage={rulesSpec.usage.LUCK} onChange={(v) => handleNumericChange("LUCK", v)} onBlur={() => handleNumericBlur("LUCK")} onDelta={(d) => handleDelta("LUCK", d)} />

            <StatCell rulesSpec={rulesSpec} label="Intellect" value={form.INT} base={rulesSpec.base.INT} usage={rulesSpec.usage.INT} onChange={(v) => handleNumericChange("INT", v)} onBlur={() => handleNumericBlur("INT")} onDelta={(d) => handleDelta("INT", d)} />
            <StatCell rulesSpec={rulesSpec} label="Appeal" value={form.APP} base={rulesSpec.base.APP} usage={rulesSpec.usage.APP} onChange={(v) => handleNumericChange("APP", v)} onBlur={() => handleNumericBlur("APP")} onDelta={(d) => handleDelta("APP", d)} />
            <StatCell rulesSpec={rulesSpec} label="Bonus" value={form.BONUS} base={rulesSpec.base.BONUS} usage={rulesSpec.usage.BONUS} onChange={(v) => handleNumericChange("BONUS", v)} onBlur={() => handleNumericBlur("BONUS")} onDelta={(d) => handleDelta("BONUS", d)} />
            
            <StatCell rulesSpec={rulesSpec} label="Spot" value={form.SPOT} base={rulesSpec.base.SPOT} usage={rulesSpec.usage.SPOT} onChange={(v) => handleNumericChange("SPOT", v)} onBlur={() => handleNumericBlur("SPOT")} onDelta={(d) => handleDelta("SPOT", d)} />
            <StatCell rulesSpec={rulesSpec} label="Perception" value={form.PER} base={rulesSpec.base.PER} usage={rulesSpec.usage.PER} onChange={(v) => handleNumericChange("PER", v)} onBlur={() => handleNumericBlur("PER")} onDelta={(d) => handleDelta("PER", d)} />
            <StatCell rulesSpec={rulesSpec} label="Sanity" value={form.SAN} base={rulesSpec.base.SAN} usage={rulesSpec.usage.SAN} onChange={(v) => handleNumericChange("SAN", v)} onBlur={() => handleNumericBlur("SAN")} onDelta={(d) => handleDelta("SAN", d)} />
            <ReadSmall label="Build" value={form.Build ?? 0} />

            <ReadSmall label="Reputation" value={form.REP ?? 0} />
            <StatCell rulesSpec={rulesSpec} label="Bravery" value={form.BRV} base={rulesSpec.base.BRV} usage={rulesSpec.usage.BRV} onChange={(v) => handleNumericChange("BRV", v)} onBlur={() => handleNumericBlur("BRV")} onDelta={(d) => handleDelta("BRV", d)} />
            <ReadSmall label="Move" value={form.MOVE ?? 8} />
            <ReadSmall label="Damage Bonus" value={form.damageBonus ?? "0"} />
            <StatCell rulesSpec={rulesSpec} label="Armor" value={form.ARMOR} base={rulesSpec.base.ARMOR} usage={rulesSpec.usage.ARMOR} onChange={(v) => handleNumericChange("ARMOR", v)} onBlur={() => handleNumericBlur("ARMOR")} onDelta={(d) => handleDelta("ARMOR", d)} isSmallStep={true} />
            <StatCell rulesSpec={rulesSpec} label="Resiliance" value={form.RES} base={rulesSpec.base.RES} usage={rulesSpec.usage.RES} onChange={(v) => handleNumericChange("RES", v)} onBlur={() => handleNumericBlur("RES")} onDelta={(d) => handleDelta("RES", d)} isSmallStep={true} />
            <ReadSmall label="Total XP" value={form.totalXP ?? 0} />
            <ReadSmall label="Used XP" value={form.usedXP ?? 0} />
          </div>

          <form onSubmit={(e) => handleSubmit(e, false)} style={styles.form}>
            <div className="sheet-grid" style={styles.grid}>
              {FIELD_DEFS.map((def) => {
                const value = form[def.key] ?? "";
                const base = rulesSpec.base[def.key];
                const usage = rulesSpec.usage[def.key];
                const isNumber = def.type === "number";
                const labelWithBase = base !== undefined ? `${def.label} ${base}` : def.label;

                const numericValue = Number(value) || 0;
                const currentCost = getCurrentCostPerPoint(rulesSpec, usage, numericValue);
                const totalCost = isNumber && usage !== undefined ? getCostBetween(rulesSpec, def.key, base ?? 0, numericValue) : 0;
                const costColor = getCostColor(currentCost);
                const tooltipText = isNumber && usage !== undefined ? `Spent: ${totalCost}` : "";
                const deltaTooltipText = `${currentCost * 5} XP`;

                const labelExtra =
                  isNumber && (usage !== undefined)
                    ? ` (Cost: ${currentCost})`
                    : "";
                const halfValue = Math.floor(numericValue / 2);
                const fifthValue = Math.floor(numericValue / 5);

                return (
                  <div key={def.key} style={styles.field}>
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

            <div className="update-buttons no-print" style={styles.buttonsBar}>
              <button
                type="button"
                style={{ ...styles.button, background: "#9ca3af" }}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Geri dön
              </button>

              <button
                type="submit"
                style={{ ...styles.button, background: "#fbbf24" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, false)}
              >
                Kaydet ve geri dön
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#22c55e" }}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, true)}
              >
                Kaydet ve sayfada kal
              </button>

              {mode === "create" && (
                <button
                  type="button"
                  style={{ ...styles.button, background: "#0ea5e9" }}
                  onClick={() => window.print()}
                >
                  Yazdır
                </button>
              )}

              <button
                type="button"
                style={{ ...styles.button, background: "#8b5cf6" }}
                onClick={handleExportJSON}
              >
                JSON'a Aktar
              </button>
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
    marginBottom: "8px",
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
};

export default PlayerForm;
