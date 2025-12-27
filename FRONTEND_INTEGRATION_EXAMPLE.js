// Example Frontend Integration - rulesEngine.js
// This is how the frontend should load and use the spec

/**
 * Manages game rules and calculations
 * Loads rules from backend API and provides calculation methods
 */
class RulesEngine {
  constructor() {
    this.spec = null;
    this.isReady = false;
  }

  /**
   * Initialize rules engine by fetching spec from backend
   * Call this once on application startup
   */
  async initialize() {
    try {
      const response = await fetch('/api/rules');
      if (!response.ok) {
        throw new Error(`Failed to load rules: ${response.status}`);
      }
      
      this.spec = await response.json();
      this.isReady = true;
      console.log('Rules loaded successfully', this.spec);
      return this.spec;
    } catch (error) {
      console.error('Failed to initialize rules engine:', error);
      throw error;
    }
  }

  /**
   * Get base value for a characteristic or skill
   * @param {string} key - Characteristic or skill name (e.g., 'APP', 'Dodge')
   * @returns {number} Base value
   */
  getBaseValue(key) {
    this.validateReady();
    return this.spec.base[key] ?? 0;
  }

  /**
   * Get usage cost (XP needed to increase by 1 point)
   * @param {string} key - Characteristic or skill name
   * @returns {number} Cost in XP per point
   */
  getUsageCost(key) {
    this.validateReady();
    return this.spec.usage[key] ?? 0;
  }

  /**
   * Get penalty configuration
   * @returns {Object} Penalty rules with thresholds and multipliers
   */
  getPenaltyRules() {
    this.validateReady();
    return this.spec.penaltyRules;
  }

  /**
   * Calculate XP cost to improve from current to target value
   * Applies progressive difficulty penalties based on thresholds
   * 
   * Example: Improving APP from 40 to 80 (usage=60, thresholds=50,75, mults=2x,3x)
   * - 40→50: 10 points × 60 = 600 XP
   * - 50→75: 25 points × 60 × 2 = 3,000 XP
   * - 75→80: 5 points × 60 × 3 = 900 XP
   * - Total: 4,500 XP
   */
  calculateCostBetween(skill, currentValue, targetValue) {
    this.validateReady();
    
    const usage = this.getUsageCost(skill);
    const penalties = this.getPenaltyRules();

    // No improvement needed
    if (targetValue <= currentValue || usage === 0) {
      return 0;
    }

    let totalCost = 0;
    let current = currentValue;

    // Segment 1: current → firstThreshold
    if (current < penalties.firstThreshold) {
      const end = Math.min(targetValue, penalties.firstThreshold);
      const diff = end - current;
      totalCost += diff * usage;
      current = end;
    }

    // Segment 2: firstThreshold → secondThreshold (2x multiplier)
    if (current < penalties.secondThreshold && current >= penalties.firstThreshold) {
      const end = Math.min(targetValue, penalties.secondThreshold);
      const diff = end - current;
      totalCost += diff * usage * penalties.firstPenaltyMult;
      current = end;
    }

    // Segment 3: secondThreshold+ (3x multiplier)
    if (current < targetValue) {
      const diff = targetValue - current;
      totalCost += diff * usage * penalties.secondPenaltyMult;
    }

    return totalCost;
  }

  /**
   * Calculate cost to reach target from base value
   * @param {string} skill - Characteristic or skill name
   * @param {number} targetValue - Target value
   * @returns {number} Total XP cost from base
   */
  calculateCostFromBase(skill, targetValue) {
    const baseValue = this.getBaseValue(skill);
    return this.calculateCostBetween(skill, baseValue, targetValue);
  }

  /**
   * Get all characteristics
   * @returns {string[]} Array of characteristic names
   */
  getCharacteristics() {
    this.validateReady();
    return [
      'APP', 'BONUS', 'BRV', 'STA', 'AGI', 'EDU', 'INT', 'LUCK', 
      'PER', 'POW', 'REP', 'SAN', 'SIZ', 'STR', 'ARMOR', 'RES'
    ];
  }

  /**
   * Get all skills
   * @returns {string[]} Array of skill names
   */
  getSkills() {
    this.validateReady();
    return Object.keys(this.spec.base).filter(key => 
      !this.getCharacteristics().includes(key) && 
      !['totalXP', 'usedXP', 'remainingXP'].includes(key)
    );
  }

  /**
   * Validate that engine is initialized
   * @throws {Error} If engine not ready
   */
  validateReady() {
    if (!this.isReady) {
      throw new Error('Rules engine not initialized. Call initialize() first.');
    }
  }

  /**
   * Get spec (for debugging)
   * @returns {Object} Complete specification
   */
  getSpec() {
    this.validateReady();
    return this.spec;
  }
}

// Export for use
export default RulesEngine;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Initialize on app startup
const rulesEngine = new RulesEngine();
await rulesEngine.initialize();

// Get base values
const appBase = rulesEngine.getBaseValue('APP');  // 30
const dodgeBase = rulesEngine.getBaseValue('Dodge');  // 20

// Get usage costs
const appCost = rulesEngine.getUsageCost('APP');  // 60 XP per point
const dodgeCost = rulesEngine.getUsageCost('Dodge');  // 180 XP per point

// Calculate improvement costs
const costAPP40To80 = rulesEngine.calculateCostBetween('APP', 40, 80);  // 4500 XP
const costDodgeFromBase = rulesEngine.calculateCostFromBase('Dodge', 60);  // From 20 to 60

// Get lists
const characteristics = rulesEngine.getCharacteristics();
const skills = rulesEngine.getSkills();

// Validate penalty rules
const penalties = rulesEngine.getPenaltyRules();
console.log(`Threshold 1: ${penalties.firstThreshold} (${penalties.firstPenaltyMult}x)`);
console.log(`Threshold 2: ${penalties.secondThreshold} (${penalties.secondPenaltyMult}x)`);
*/
