import { XPGain } from '../types/ranking';

export const calculateXPGain = (
  score: number,
  timeSpent: number,
  targetTime: number,
  won: boolean,
  rivalCount: number = 1
): XPGain[] => {
  const gains: XPGain[] = [];
  
  // Base XP for participation
  gains.push({
    source: 'participation',
    amount: 10,
    description: '参加ボーナス'
  });
  
  // Score-based XP
  const scoreXP = Math.floor(score / 10);
  if (scoreXP > 0) {
    gains.push({
      source: 'score',
      amount: scoreXP,
      description: `スコアボーナス (${score}点)`
    });
  }
  
  // Time bonus (if completed faster than target)
  if (timeSpent < targetTime) {
    const timeBonus = Math.floor((targetTime - timeSpent) / 10);
    gains.push({
      source: 'time',
      amount: timeBonus,
      description: '時間ボーナス'
    });
  }
  
  // Victory bonus
  if (won) {
    const victoryBonus = 25 + (rivalCount - 1) * 10;
    gains.push({
      source: 'victory',
      amount: victoryBonus,
      description: rivalCount > 1 ? `勝利ボーナス (${rivalCount}人対戦)` : '勝利ボーナス'
    });
  }
  
  // Accuracy bonus (if score > 80)
  if (score > 80) {
    gains.push({
      source: 'accuracy',
      amount: 15,
      description: '高精度ボーナス'
    });
  }
  
  return gains;
};

export const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getXPForLevel = (level: number): number => {
  // XP needed for level: (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
};

export const getXPForNextLevel = (level: number): number => {
  return Math.pow(level, 2) * 100;
};

export const getProgressToNextLevel = (xp: number): { current: number; needed: number; percentage: number } => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const progressXP = xp - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  
  return {
    current: progressXP,
    needed: neededXP,
    percentage: (progressXP / neededXP) * 100
  };
};