import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MultiplayerGame, Player, MultiplayerResults } from '../types/multiplayer';

interface MultiplayerContextType {
  currentGame: MultiplayerGame | null;
  setCurrentGame: (game: MultiplayerGame | null) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  problemCount: number;
  setProblemCount: (count: number) => void;
  timePerProblem: number;
  setTimePerProblem: (time: number) => void;
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  gameResults: MultiplayerResults | null;
  setGameResults: (results: MultiplayerResults | null) => void;
  updatePlayerScore: (playerId: string, correctAnswers: number) => void;
  resetGame: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

export const MultiplayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<MultiplayerGame | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { id: 'player1', name: 'Player 1', score: 0, progress: 0, correctAnswers: 0, isFinished: false },
    { id: 'player2', name: 'Player 2', score: 0, progress: 0, correctAnswers: 0, isFinished: false }
  ]);
  const [problemCount, setProblemCount] = useState<number>(10);
  const [timePerProblem, setTimePerProblem] = useState<number>(60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [gameResults, setGameResults] = useState<MultiplayerResults | null>(null);

  const updatePlayerScore = (playerId: string, correctAnswers: number) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        const accuracy = (correctAnswers / problemCount) * 100;
        const targetTime = problemCount * timePerProblem;
        const timeScore = Math.min(100, (targetTime * 0.8) / elapsedTime * 100);
        const totalScore = Math.round((accuracy * 0.6) + (timeScore * 0.4));
        
        return {
          ...player,
          correctAnswers,
          score: totalScore,
          progress: 100,
          isFinished: true,
          completionTime: elapsedTime
        };
      }
      return player;
    }));
  };

  const resetGame = () => {
    setCurrentGame(null);
    setPlayers(prev => prev.map(player => ({
      ...player,
      score: 0,
      progress: 0,
      correctAnswers: 0,
      isFinished: false,
      completionTime: undefined
    })));
    setElapsedTime(0);
    setIsGameActive(false);
    setGameResults(null);
  };

  return (
    <MultiplayerContext.Provider
      value={{
        currentGame,
        setCurrentGame,
        players,
        setPlayers,
        problemCount,
        setProblemCount,
        timePerProblem,
        setTimePerProblem,
        elapsedTime,
        setElapsedTime,
        isGameActive,
        setIsGameActive,
        gameResults,
        setGameResults,
        updatePlayerScore,
        resetGame,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};