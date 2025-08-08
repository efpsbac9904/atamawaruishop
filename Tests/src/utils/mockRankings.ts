import { UserRanking } from '../types/ranking';
import { calculateLevel } from './xpSystem';
import { getUserLeague } from './leagueSystem';

// Fixed XP values for consistent bot rankings
const fixedBotXPValues = [
  45000,44329,43924,42168, 42000,41192, 38034, 35000,33500, 32000, 28000, 25000, 22000, 19000, 16000,
  14000, 12500, 11000, 9500, 8200, 7000, 6200, 5500, 4800,4800, 4800, 4800, 4800, 4800, 4200,
  3800, 3400, 3000, 2700, 2400, 2100, 1900, 1700, 1500, 1300,
  1100, 950, 800, 700, 600, 500, 450, 400, 350, 300,
  280, 260, 240, 220, 200, 180, 160, 140, 120, 100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
];

const mockNames = [
   '健一レベル','イモータル帝王', 'レジェンド覇者', 'チャレンジャー王', 'グランドマスター', 'マスター級',
  'ダイヤモンド戦士', 'プラチナエース', 'ゴールドヒーロー', 'シルバーナイト', 'ブロンズファイター',
  '学習マスター', 'クイズキング', '知識の探求者', 'スピードラーナー', '集中力の達人',
  '問題解決のプロ', '記憶の魔術師', '論理思考の天才', '創造的思考家', '分析のエキスパート',
  '効率学習者', '継続の力', '挑戦者', '向上心の塊', '努力の結晶',
  '知恵の泉', '洞察力の持ち主', '理解の達人', '応用力の鬼', '基礎固めの王',
  '復習の鬼', '予習の達人', 'ノート魔人', '暗記のプロ', '理解重視派',
  '学習の鬼', '知識コレクター', '理論派', '実践派', '完璧主義者',
  '努力家', '天才肌', '研究者', '探究心', '向学心',
  '勉強好き', '知識欲', '学問の徒', '真理追求者', '智慧者',
  '博学者', '学者', '研鑽者', '修行者', '求道者','匿名','NoName'
];

const generateMockUser = (id: string, baseXP: number): UserRanking => {
  const xp = Math.max(0, baseXP);
  const league = getUserLeague(xp);
  
  return {
    id,
    name: mockNames[Math.floor(Math.random() * mockNames.length)],
    xp,
    level: calculateLevel(xp),
    rank: 0, // Will be calculated later
    league: league.name,
    leagueRank: 0, // Will be calculated later
    avatar: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo-${1000000 + Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`
  };
};

export const generateMockRankings = (userXP: number, userName: string): UserRanking[] => {
  const rankings: UserRanking[] = [];
  const userLeague = getUserLeague(userXP);
  
  // Add current user
  rankings.push({
    id: 'current-user',
    name: userName,
    xp: userXP,
    level: calculateLevel(userXP),
    rank: 0,
    league: userLeague.name,
    leagueRank: 0,
    isCurrentUser: true
  });
  
  // Generate bots with fixed XP values
  fixedBotXPValues.forEach((xp, index) => {
    rankings.push(generateMockUser(`bot-${index}`, xp));
  });
  
  // Add some bots around user's XP for nearby rankings
  for (let i = 0; i < 10; i++) {
    const variation = (i - 5) * 50; // -250 to +200 XP around user
    const botXP = Math.max(0, userXP + variation);
    rankings.push(generateMockUser(`nearby-bot-${i}`, botXP));
  }
  
  // Sort by XP (descending) and assign ranks
  rankings.sort((a, b) => b.xp - a.xp);
  rankings.forEach((user, index) => {
    user.rank = index + 1;
  });
  
  // Calculate league ranks
  const leagueGroups = new Map<string, UserRanking[]>();
  rankings.forEach(user => {
    if (!leagueGroups.has(user.league)) {
      leagueGroups.set(user.league, []);
    }
    leagueGroups.get(user.league)!.push(user);
  });
  
  leagueGroups.forEach(users => {
    users.sort((a, b) => b.xp - a.xp);
    users.forEach((user, index) => {
      user.leagueRank = index + 1;
    });
  });
  
  return rankings;
};