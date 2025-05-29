import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Character } from '../types/characters';
import { characterData } from '../data/characters';

interface RivalProgress {
  id: string;
  progress: number;
  score?: number;
  clearTime?: number;
}

interface AppContextType {
  selectedRivals: Character[];
  setSelectedRivals: (rivals: Character[]) => void;
  problemCount: number;
  setProblemCount: (count: number) => void;
  timePerProblem: number;
  setTimePerProblem: (time: number) => void;
  currentProblem: number;
  setCurrentProblem: (problem: number) => void;
  userProgress: number;
  setUserProgress: (progress: number) => void;
  rivalsProgress: RivalProgress[];
  setRivalsProgress: (progress: RivalProgress[]) => void;
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  isCompetitionActive: boolean;
  setIsCompetitionActive: (active: boolean) => void;
  userScore: number;
  setUserScore: (score: number) => void;
  correctAnswers: number;
  setCorrectAnswers: (count: number) => void;
  resetCompetition: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRivals, setSelectedRivals] = useState<Character[]>([]);
  const [problemCount, setProblemCount] = useState<number>(10);
  const [timePerProblem, setTimePerProblem] = useState<number>(60);
  const [currentProblem, setCurrentProblem] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<number>(0);
  const [rivalsProgress, setRivalsProgress] = useState<RivalProgress[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompetitionActive, setIsCompetitionActive] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const resetCompetition = () => {
    setCurrentProblem(0);
    setUserProgress(0);
    setRivalsProgress([]);
    setElapsedTime(0);
    setIsCompetitionActive(false);
    setUserScore(0);
    setCorrectAnswers(0);
  };

  return (
    <AppContext.Provider
      value={{
        selectedRivals,
        setSelectedRivals,
        problemCount,
        setProblemCount,
        timePerProblem,
        setTimePerProblem,
        currentProblem,
        setCurrentProblem,
        userProgress,
        setUserProgress,
        rivalsProgress,
        setRivalsProgress,
        elapsedTime,
        setElapsedTime,
        isCompetitionActive,
        setIsCompetitionActive,
        userScore,
        setUserScore,
        correctAnswers,
        setCorrectAnswers,
        resetCompetition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};