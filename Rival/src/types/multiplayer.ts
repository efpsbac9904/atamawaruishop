export interface Player {
  id: string;
  name: string;
  score: number;
  progress: number;
  correctAnswers: number;
  isFinished: boolean;
  completionTime?: number;
}

export interface MultiplayerGame {
  id: string;
  players: Player[];
  settings: {
    problemCount: number;
    timePerProblem: number;
  };
  status: 'setup' | 'countdown' | 'active' | 'finished';
  startTime: number;
  endTime?: number;
  results?: MultiplayerResults;
}

export interface MultiplayerResults {
  rankings: PlayerRanking[];
  gameStats: {
    totalTime: number;
    averageScore: number;
  };
}

export interface PlayerRanking {
  rank: number;
  player: Player;
  finalScore: number;
  completionTime: number;
}