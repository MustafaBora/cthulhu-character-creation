# Spec-to-Player Mapping Reference

## Characteristics Mapping

These are the Player model attributes and their corresponding spec keys:

| Player Attribute | Spec Key | Type | Base Value | Usage Cost |
|------------------|----------|------|------------|------------|
| APP | APP | Characteristic | 30 | 60 |
| BONUS | BONUS | Characteristic | 0 | 120 |
| BRV | BRV | Characteristic | 45 | 120 |
| CON | STA | Characteristic | 30 | 120 |
| DEX | AGI | Characteristic | 35 | 220 |
| EDU | EDU | Characteristic | 20 | 20 |
| INT | INT | Characteristic | 30 | 60 |
| LUCK | LUCK | Characteristic | 35 | 180 |
| PER | PER | Characteristic | 0 | 320 |
| POW | POW | Characteristic | 30 | 140 |
| REP | REP | Characteristic | 1 | 100 |
| SAN | SAN | Characteristic | 45 | 160 |
| SIZ | SIZ | Characteristic | 31 | 40 |
| STR | STR | Characteristic | 25 | 100 |
| ARMOR | ARMOR | Special | 0 | 15000 |
| RES | RES | Special | 0 | 15000 |

## Skills Mapping

These are skill-related Player attributes and their corresponding spec keys:

| Player Attribute | Spec Key | Base | Cost | 
|------------------|----------|------|------|
| Accounting | Accounting | 7 | 20 |
| Anthropology | Anthropology | 6 | 20 |
| Appraise | Appraise | 8 | 20 |
| Archeology | Archeology | 3 | 20 |
| ArtCraft | Art Craft | 15 | 20 |
| ArtCraft2 | Art Craft 2 | 14 | 20 |
| Charm | Charm | 20 | 120 |
| Climb | Climb | 20 | 60 |
| CreditRating | Credit Rating | 5 | 120 |
| CthulhuMythos | Cthulhu Mythos | 0 | 160 |
| Disguise | Disguise | 5 | 40 |
| Dodge | Dodge | 20 | 180 |
| DriveAuto | Drive Auto | 10 | 80 |
| ElectricalRepair | Electrical Repair | 15 | 40 |
| FastTalk | Fast Talk | 14 | 120 |
| FightingBrawl | Fighting Brawl | 30 | 160 |
| FightingOther | Fighting Other | 30 | 160 |
| FirearmsHandgun | Firearms Handgun | 30 | 160 |
| FirearmsOther | Firearms Other | 30 | 140 |
| FirearmsRifleShotgun | Firearms Rifle Shotgun | 30 | 140 |
| FirstAid | First Aid | 20 | 100 |
| History | History | 10 | 60 |
| Intimidate | Intimidate | 15 | 100 |
| Jump | Jump | 20 | 80 |
| LanguageOther1 | Language Other 1 | 20 | 40 |
| LanguageOther2 | Language Other 2 | 0 | 20 |
| LanguageOther3 | Language Other 3 | 0 | 20 |
| LanguageOwn | Language Own | 50 | 20 |
| Law | Law | 5 | 40 |
| LibraryUse | Library Use | 20 | 160 |
| Listen | Listen | 30 | 160 |
| Locksmith | Locksmith | 10 | 120 |
| MechanicalRepair | Mechanical Repair | 15 | 40 |
| Medicine | Medicine | 4 | 40 |
| NaturalWorld | Natural World | 15 | 60 |
| Navigate | Navigate | 15 | 40 |
| Occult | Occult | 4 | 60 |
| Persuade | Persuade | 15 | 180 |
| Pilot | Pilot | 1 | 20 |
| Psychoanalysis | Psychoanalysis | 2 | 20 |
| Psychology | Psychology | 10 | 120 |
| Ride | Ride | 10 | 80 |
| Science | Science | 10 | 40 |
| ScienceOther | Science Other | 21 | 20 |
| ScienceOther2 | Science Other 2 | 20 | 20 |
| SleightOfHand | Sleight Of Hand | 10 | 100 |
| SPOT | SPOT | 15 | 260 |
| Stealth | Stealth | 20 | 140 |
| Survival | Survival | 11 | 20 |
| Swim | Swim | 22 | 20 |
| Throw | Throw | 20 | 100 |
| Track | Track | 10 | 40 |

## How CostServiceByUsage Uses This Mapping

When `calculateXP(player)` is called:

```java
// Example: APP characteristic
int APP = getCostBetween("APP",  // Spec key
    rulesService.getBaseValue("APP"),  // Base value (30)
    player.getAPP());  // Current player value

// This calculates cost from base 30 to whatever player.getAPP() is
```

For each characteristic and skill, the pattern is:
1. Get the spec key name (e.g., "APP", "Dodge", "Psychology")
2. Get base value from spec: `rulesService.getBaseValue(key)`
3. Get player's current value: `player.getAttribute()`
4. Calculate cost: `getCostBetween(key, baseValue, playerValue)`
5. Add to total XP cost

## Adding a New Skill

To add a new skill "NewSkill":

### Step 1: Update Player Model
```java
private int newSkill;

public int getNewSkill() { return newSkill; }
public void setNewSkill(int value) { this.newSkill = value; }
```

### Step 2: Update RulesService
In `initializeRulesSpec()`, add to both maps:

```java
// Base values map
Map.entry("New Skill", 15),  // Starting value

// Usage costs map  
Map.entry("New Skill", 100),  // XP cost per point
```

### Step 3: Update CostServiceByUsage
In `calculateXP()` method:

```java
int NewSkill = getCostBetween(
    "New Skill",  // Must match spec key exactly!
    rulesService.getBaseValue("New Skill"),
    player.getNewSkill()
);
```

Then add `NewSkill` to the `totalCost` sum.

### Step 4: Frontend Gets It Automatically
Frontend loads `/api/rules` and gets the new skill automatically:
```javascript
const newSkillBase = spec.base["New Skill"];  // 15
const newSkillCost = spec.usage["New Skill"];  // 100
```

## Common Pitfalls

### ❌ Wrong Spec Key Name
```java
// WRONG - Doesn't match spec
getCostBetween("ApplicationProgramming", ...);

// RIGHT
getCostBetween("APP", ...);
```

### ❌ Wrong Player Method
```java
// WRONG - Player doesn't have this method
player.getAPP_Appearance();

// RIGHT
player.getAPP();
```

### ❌ Forgetting to Add to Total
```java
// WRONG - Calculated but never added
int APP = getCostBetween("APP", ...);
// int totalCost = ... (doesn't include APP)

// RIGHT
int APP = getCostBetween("APP", ...);
int totalCost = APP + BONUS + BRV + ... // Include all
```

### ❌ Case Sensitivity
Spec keys are case-sensitive:
- `"APP"` ✅
- `"app"` ❌
- `"App"` ❌

## Verification Checklist

For each characteristic/skill in Player model:

- [ ] Spec key name matches exactly (case-sensitive)
- [ ] Base value in RulesService.base map
- [ ] Usage cost in RulesService.usage map
- [ ] getCostBetween() call in calculateXP()
- [ ] Result added to totalCost sum
- [ ] Frontend can access via spec.base[key] and spec.usage[key]

## Test Example

```java
@Test
void testAPPMapping() {
    // Verify spec has correct values
    assertEquals(30, rulesService.getBaseValue("APP"));
    assertEquals(60, rulesService.getUsageCost("APP"));
    
    // Verify calculation
    Player player = new Player();
    player.setAPP(50);
    
    int cost = costService.getCostBetween("APP", 30, 50);
    // 50 < 75, so: (50-30) * 60 = 1200 XP
    assertEquals(1200, cost);
}
```

## Notes

- All values are integers (no floating point)
- Base values represent starting/default state
- Usage cost = XP needed to increase by 1 point
- Some characteristics have base 0 (PER, BONUS)
- Some characteristics have very high usage (ARMOR, RES = 15000)
- Some skills have base 0 (Cthulhu Mythos, Language Other 2/3)
