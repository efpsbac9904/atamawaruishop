export interface League {
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  description: string;
}

export const leagues: League[] = [
  {
    name: 'ブロンズ',
    minXP: 0,
    maxXP: 999,
    color: '#CD7F32',
    icon: '🥉',
    description: '学習を始めたばかりの初心者リーグ'
  },
  {
    name: 'シルバー',
    minXP: 1000,
    maxXP: 2499,
    color: '#C0C0C0',
    icon: '🥈',
    description: '基礎を固めた学習者のリーグ'
  },
  {
    name: 'ゴールド',
    minXP: 2500,
    maxXP: 4999,
    color: '#FFD700',
    icon: '🥇',
    description: '安定した実力を持つ学習者のリーグ'
  },
  {
    name: 'プラチナ',
    minXP: 5000,
    maxXP: 7999,
    color: '#E5E4E2',
    icon: '💎',
    description: '高い学習能力を持つエリートリーグ'
  },
  {
    name: 'ダイヤモンド',
    minXP: 8000,
    maxXP: 11999,
    color: '#B9F2FF',
    icon: '💠',
    description: '優秀な学習者が集うリーグ'
  },
  {
    name: 'マスター',
    minXP: 12000,
    maxXP: 16999,
    color: '#9966CC',
    icon: '🔮',
    description: '学習の達人が競い合うリーグ'
  },
  {
    name: 'グランドマスター',
    minXP: 17000,
    maxXP: 22999,
    color: '#FF6B6B',
    icon: '👑',
    description: '最高峰の学習者のみが到達できるリーグ'
  },
  {
    name: 'チャレンジャー',
    minXP: 23000,
    maxXP: 29999,
    color: '#4ECDC4',
    icon: '⚡',
    description: '伝説的な学習能力を持つ挑戦者のリーグ'
  },
  {
    name: 'レジェンド',
    minXP: 30000,
    maxXP: 39999,
    color: '#FF9500',
    icon: '🌟',
    description: '神話級の学習者が集う伝説のリーグ'
  },
  {
    name: 'イモータル',
    minXP: 40000,
    maxXP: 100000,
    color: '#8A2BE2',
    icon: '🔥',
    description: '不滅の学習精神を持つ最高位のリーグ'
  },
   {
    name: 'チーター',
    minXP: 100001,
    maxXP: Infinity,
    color: '#000000',
    icon: '🐆',
    description: '不滅の学習精神を持つ最高位のリーグ'
  }
];

export const getUserLeague = (xp: number): League => {
  return leagues.find(league => xp >= league.minXP && xp <= league.maxXP) || leagues[0];
};

export const getLeagueProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const currentLeague = getUserLeague(xp);
  const progressXP = xp - currentLeague.minXP;
  const neededXP = currentLeague.maxXP === Infinity ? 0 : currentLeague.maxXP - currentLeague.minXP + 1;
  
  if (currentLeague.maxXP === Infinity) {
    return {
      current: progressXP,
      needed: 0,
      percentage: 100
    };
  }
  
  return {
    current: progressXP,
    needed: neededXP,
    percentage: (progressXP / neededXP) * 100
  };
};