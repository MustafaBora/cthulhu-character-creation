# Spec-Driven Rules System - Quick Reference

## What Changed

### ✅ New Components
1. **RulesSpec.java** - DTO defining JSON structure
2. **RulesService.java** - Service with all rules definitions
3. **RulesController.java** - API endpoint `/api/rules`
4. **Frontend Integration Example** - JavaScript reference implementation

### ✅ Refactored
- **CostServiceByUsage.java** - Now uses RulesService instead of hardcoded maps

## Quick Start

### Backend
```java
// RulesService is singleton - autowire it
@Autowired
private RulesService rulesService;

// Get individual values
int baseAPP = rulesService.getBaseValue("APP");  // 30
int costAPP = rulesService.getUsageCost("APP");  // 60

// Get complete spec
RulesSpec spec = rulesService.getRulesSpec();
```

### Frontend
```javascript
// Initialize on startup
const rulesEngine = new RulesEngine();
await rulesEngine.initialize();  // Calls GET /api/rules

// Use in calculations
const cost = rulesEngine.calculateCostBetween('APP', 30, 50);
const costFromBase = rulesEngine.calculateCostFromBase('Dodge', 60);
```

## API Endpoint

**GET /api/rules**

Returns:
```json
{
  "base": { "APP": 30, ... },
  "usage": { "APP": 60, ... },
  "penaltyRules": {
    "firstThreshold": 50,
    "secondThreshold": 75,
    "firstPenaltyMult": 2,
    "secondPenaltyMult": 3
  }
}
```

## File Locations

| File | Purpose | Location |
|------|---------|----------|
| RulesSpec | DTO | dto/RulesSpec.java |
| RulesService | Service (source of truth) | service/RulesService.java |
| RulesController | API endpoint | controller/RulesController.java |
| CostServiceByUsage | Cost calculations (refactored) | service/CostServiceByUsage.java |
| Frontend Example | JS integration guide | FRONTEND_INTEGRATION_EXAMPLE.js |
| Full Docs | Complete documentation | SPEC_DRIVEN_RULES.md |
| Implementation Summary | What was done | IMPLEMENTATION_SUMMARY.md |

## Key Design Principles

### Single Source of Truth
- Rules defined **once** in RulesService
- Both backend and frontend load from same API
- Changes propagate automatically

### No Code Duplication
- Removed ~160 lines of duplicate BASE/USAGE maps
- CostServiceByUsage now calls RulesService
- Frontend loads spec from API

### Type Safety
- RulesSpec DTO ensures structure validation
- Frontend can validate against spec schema
- IDE support for autocomplete

### Easy to Update
Add new skill or change values → Update RulesService only

## Example: Adding New Skill

**Before (Duplicated)**:
1. Add to Java code in CostServiceByUsage BASE map
2. Add to Java code in CostServiceByUsage USAGE map  
3. Add to frontend code
4. Risk of desynchronization

**After (Single Source)**:
1. Add to RulesService.initializeRulesSpec() method
2. Done! Frontend loads automatically from `/api/rules`

## Cost Calculation Formula

For value between `current` and `target`:

```
if current < threshold1 (50):
  cost += (min(target, threshold1) - current) × usage

if current < threshold2 (75) and current ≥ threshold1:
  cost += (min(target, threshold2) - current) × usage × 2x

if current < target and current ≥ threshold2:
  cost += (target - current) × usage × 3x
```

## Testing Checklist

- [ ] `GET /api/rules` returns valid JSON
- [ ] RulesService provides correct base values
- [ ] RulesService provides correct usage costs
- [ ] CostServiceByUsage uses RulesService values
- [ ] Frontend calculates costs using same algorithm
- [ ] Frontend validation uses spec values
- [ ] Adding new skill works end-to-end

## Performance Notes

- RulesService is a singleton Spring bean (instantiated once)
- Initialization happens on app startup
- All maps are immutable (Map.ofEntries)
- No database calls (all hardcoded)
- Future: Can be moved to database for runtime updates

## Debugging

### Check if engine is ready
```javascript
console.log(rulesEngine.isReady);  // true/false
```

### View complete spec
```javascript
console.log(rulesEngine.getSpec());
```

### Verify calculation
```javascript
const cost = rulesEngine.calculateCostBetween('APP', 40, 80);
console.log(`Improving APP 40→80 costs ${cost} XP`);
```

### Backend debugging
```java
System.out.println(rulesService.getBaseValue("APP"));
System.out.println(rulesService.getUsageCost("APP"));
System.out.println(rulesService.getPenaltyRules());
```

## Future Enhancements

1. **Database Persistence** - Store rules in DB for runtime updates
2. **Version Control** - Track rule changes with versions
3. **Validation Endpoint** - POST endpoint to validate calculations
4. **Rule Audit** - Log all rule changes with timestamps
5. **Multi-Language** - Support different rule sets
6. **Export/Import** - CSV, YAML formats
7. **Rules Editor UI** - Admin interface to manage rules

## Common Mistakes to Avoid

❌ Hardcoding rule values in frontend
✅ Always load from `/api/rules`

❌ Calculating costs without using penalty rules
✅ Always apply progressive multipliers

❌ Forgetting to initialize RulesEngine
✅ Call `initialize()` on app startup

❌ Assuming exact values will match without checking
✅ Always verify `/api/rules` loads before making calculations
