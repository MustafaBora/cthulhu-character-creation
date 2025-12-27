# Spec-Driven Rules System

## Overview

The Spec-Driven Rules system provides a **single source of truth** for all game calculation rules. Both the backend and frontend load the same JSON specification, eliminating code duplication and ensuring consistent calculations across the application.

### Problem Solved
- ✅ **No code duplication** - Rules defined once, used everywhere
- ✅ **Easy updates** - Change rules in one place, affects frontend and backend immediately
- ✅ **Consistent calculations** - Same algorithm on both sides
- ✅ **Type-safe** - Frontend can validate inputs using the spec

## Architecture

### Backend Components

#### 1. `RulesService` (Single Source of Truth)
Location: `src/main/java/com/bora/d100/service/RulesService.java`

Initializes and provides access to the complete rules specification:
```java
// Get base values (starting points)
int baseValue = rulesService.getBaseValue("APP");

// Get usage costs (XP needed per point increase)
int usageCost = rulesService.getUsageCost("APP");

// Get penalty rules
RulesSpec.PenaltyRules penalties = rulesService.getPenaltyRules();

// Get complete spec
RulesSpec spec = rulesService.getRulesSpec();
```

#### 2. `RulesSpec` DTO
Location: `src/main/java/com/bora/d100/dto/RulesSpec.java`

Defines the JSON structure with:
- **base**: Starting values for characteristics and skills
- **usage**: XP cost to increase each by 1 point
- **penaltyRules**: Thresholds and multipliers for difficulty scaling

#### 3. `RulesController` - API Endpoint
Location: `src/main/java/com/bora/d100/controller/RulesController.java`

```
GET /api/rules
```

Returns the complete rules specification as JSON. Frontend loads this on startup.

#### 4. `CostServiceByUsage` (Refactored)
Location: `src/main/java/com/bora/d100/service/CostServiceByUsage.java`

**Before**: Hardcoded maps for BASE and USAGE values
**After**: Uses `RulesService` to fetch values dynamically

Example:
```java
// Old - hardcoded values
int usage = USAGE.get(skill);

// New - from spec
int usage = rulesService.getUsageCost(skill);
```

## How Calculations Work

### Penalty System
Characteristics and skills become more expensive to improve as they increase:

1. **0-50**: Normal cost = usage × (targetValue - currentValue)
2. **50-75**: 2x multiplier = usage × 2 × (targetValue - currentValue)  
3. **75+**: 3x multiplier = usage × 3 × (targetValue - currentValue)

### Example
Improving APP from 40 to 80 (usage cost = 60):
- 40→50: 10 × 60 = 600 XP (normal)
- 50→75: 25 × 60 × 2 = 3,000 XP (2x penalty)
- 75→80: 5 × 60 × 3 = 900 XP (3x penalty)
- **Total: 4,500 XP**

## Frontend Integration

The frontend loads the spec from `/api/rules` and uses it for:

### 1. Client-Side Cost Calculation
```javascript
// Fetch spec on startup
const spec = await fetch('/api/rules').then(r => r.json());

// Calculate costs using same algorithm as backend
function calculateCost(skill, current, target) {
  const usage = spec.usage[skill];
  const penalties = spec.penaltyRules;
  
  let cost = 0;
  
  // Apply penalty logic based on value ranges
  if (current < penalties.firstThreshold) {
    const end = Math.min(target, penalties.firstThreshold);
    cost += (end - current) * usage;
  }
  // ... (continue for other thresholds)
  
  return cost;
}
```

### 2. Real-Time Validation
Validate user input against base and usage values:
```javascript
const baseDEX = spec.base['AGI']; // Starting DEX value
const dexUsage = spec.usage['AGI']; // Cost per point
```

### 3. Display Characteristics/Skills List
```javascript
// Render all skills with their base values
const skills = Object.keys(spec.base).filter(k => k !== 'totalXP');
skills.forEach(skill => {
  console.log(`${skill}: base=${spec.base[skill]}, cost=${spec.usage[skill]}`);
});
```

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Rule Changes** | Update 2 places (Java + Frontend) | Update 1 place (RulesService) |
| **Bug Fixes** | Potential sync issues | Always in sync |
| **New Skills** | Add to 2 maps + UI code | Add to RulesService, frontend loads from API |
| **Validation** | Manual checks | Spec-driven validation |
| **Maintainability** | High (scattered logic) | Low (centralized) |

## Example JSON Response

```json
{
  "base": {
    "APP": 30,
    "AGI": 35,
    "INT": 30,
    "Dodge": 20,
    "Listen": 30
  },
  "usage": {
    "APP": 60,
    "AGI": 220,
    "INT": 60,
    "Dodge": 180,
    "Listen": 160
  },
  "penaltyRules": {
    "firstThreshold": 50,
    "secondThreshold": 75,
    "firstPenaltyMult": 2,
    "secondPenaltyMult": 3
  }
}
```

## File Locations

```
src/main/
├── java/com/bora/d100/
│   ├── controller/
│   │   ├── RulesController.java (NEW)
│   │   └── PlayerController.java
│   ├── dto/
│   │   └── RulesSpec.java (NEW)
│   └── service/
│       ├── RulesService.java (NEW)
│       └── CostServiceByUsage.java (REFACTORED)
└── resources/
    └── rules-spec-example.json (REFERENCE)
```

## Testing

### Backend
```java
// Test RulesService provides correct values
rulesService.getBaseValue("APP"); // Should return 30
rulesService.getUsageCost("APP"); // Should return 60

// Test endpoint returns valid spec
GET /api/rules // Should return 200 with complete RulesSpec
```

### Frontend
```javascript
// Fetch and validate spec structure
fetch('/api/rules')
  .then(r => r.json())
  .then(spec => {
    assert(spec.base.APP === 30);
    assert(spec.usage.APP === 60);
    assert(spec.penaltyRules.firstThreshold === 50);
  });
```

## Future Enhancements

1. **Database Persistence**: Store rules spec in database for runtime updates
2. **Version Control**: Track rule changes with versions/branches
3. **Validation Endpoint**: POST endpoint to validate calculations
4. **Export**: Export rules to different formats (CSV, YAML)
5. **Multi-Language**: Support different rule sets for different game versions

## Notes

- All calculations use integer arithmetic (no floating point)
- Backend remains source of truth (frontend calculations are optional optimizations)
- Changes to penalty thresholds in RulesService automatically affect all calculations
