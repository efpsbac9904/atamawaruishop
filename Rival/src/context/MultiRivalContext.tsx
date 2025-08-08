import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MultiRivalGame, RivalProgress, MultiRivalResults } from '../types/multiRival';
import { Character } from '../types/characters';

interface MultiRivalContextType {
  currentGame: MultiRivalGame | null;
  setCurrentGame: (game: MultiRivalGame | null) => void;
  selectedRivals: Character[];
  setSelectedRivals: (rivals: Character[]) => void;
  maxRivals: number;
  setMaxRivals: (count: number) => void;
  problemCount: number;
  setProblemCount: (count: number) => void;
  timePerProblem: number;
  setTimePerProblem: (time: number) => void;
  playerProgress: number;
  setPlayerProgress: (progress: number) => void;
  rivalProgresses: RivalProgress[];
  setRivalProgresses: (progresses: RivalProgress[]) => void;
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  playerScore: number;
  setPlayerScore: (score: number) => void;
  gameResults: MultiRivalResults | null;
  setGameResults: (results: MultiRivalResults | null) => void;
  resetGame: () => void;
}

const MultiRivalContext = createContext<MultiRivalContextType | undefined>(undefined);

export const useMultiRival = () => {
  const context = useContext(MultiRivalContext);
  if (context === undefined) {
    throw new Error('useMultiRival must be used within a MultiRivalProvider');
  }
  return context;
};

export const MultiRivalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<MultiRivalGame | null>(null);
  const [selectedRivals, setSelectedRivals] = useState<Character[]>([]);
  const [maxRivals, setMaxRivals] = useState<number>(3);
  const [problemCount, setProblemCount] = useState<number>(10);
  const [timePerProblem, setTimePerProblem] = useState<number>(60);
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [rivalProgresses, setRivalProgresses] = useState<RivalProgress[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [gameResults, setGameResults] = useState<MultiRivalResults | null>(null);

  const resetGame = () => {
    setCurrentGame(null);
    setPlayerProgress(0);
    setRivalProgresses([]);
    setElapsedTime(0);
    setIsGameActive(false);
    setPlayerScore(0);
    setGameResults(null);
  };

  return (
    <MultiRivalContext.Provider
      value={{
        currentGame,
        setCurrentGame,
        selectedRivals,
        setSelectedRivals,
        maxRivals,
        setMaxRivals,
        problemCount,
        setProblemCount,
        timePerProblem,
        setTimePerProblem,
        playerProgress,
        setPlayerProgress,
        rivalProgresses,
        setRivalProgresses,
        elapsedTime,
        setElapsedTime,
        isGameActive,
        setIsGameActive,
        playerScore,
        setPlayerScore,
        gameResults,
        setGameResults,
        resetGame,
      }}
    >
      {children}
    </MultiRivalContext.Provider>
  );
};