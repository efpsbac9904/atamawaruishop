export interface MultiRivalGame {
  id: string;
  playerProgress: number;
  playerScore: number;
  rivals: RivalProgress[];
  settings: {
    problemCount: number;
    timePerProblem: number;
    rivalCount: number;
  };
  status: 'setup' | 'countdown' | 'active' | 'finished';
  startTime: number;
  endTime?: number;
  results?: MultiRivalResults;
}

export interface RivalProgress {
  character: {
    id: string;
    name: string;
    avatar: string;
    color: string;
    stats: {
      speed: number;
      accuracy: number;
      consistency: number;
    };
  };
  progress: number;
  score: number;
  completedAt?: number;
  isFinished: boolean;
}

export interface MultiRivalResults {
  playerRank: number;
  totalParticipants: number;
  rankings: RankingEntry[];
  playerStats: {
    score: number;
    completionTime: number;
    accuracy: number;
  };
}

export interface RankingEntry {
  rank: number;
  name: string;
  score: number;
  completionTime: number;
  isPlayer: boolean;
  character?: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  };
}