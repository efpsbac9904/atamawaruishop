export interface Character {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  learningStyle: string;
  description: string;
  stats: {
    speed: number;
    accuracy: number;
    consistency: number;
  };
  color: string;
}

export interface CompetitionResult {
  timeSpent: number;
  problemsSolved: number;
  accuracyRate: number;
  totalScore: number;
}