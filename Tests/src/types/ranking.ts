export interface UserRanking {
  id: string;
  name: string;
  xp: number;
  level: number;
  rank: number;
  league: string;
  leagueRank: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface XPGain {
  source: string;
  amount: number;
  description: string;
}

export interface RankingData {
  currentUser: UserRanking;
  topRankings: UserRanking[];
  nearbyRankings: UserRanking[];
  totalUsers: number;
  currentLeague: string;
  leagueRankings: UserRanking[];
}