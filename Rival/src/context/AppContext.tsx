import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Character } from '../types/characters';

interface UserProfile {
  name: string;
  level: number;
  competitions: number;
  victories: number;
  accuracy: number;
  streak: number;
  xp: number;
}

interface AppContextType {
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character | null) => void;
  problemCount: number;
  setProblemCount: (count: number) => void;
  timePerProblem: number;
  setTimePerProblem: (time: number) => void;
  currentProblem: number;
  setCurrentProblem: (problem: number) => void;
  userProgress: number;
  setUserProgress: (progress: number) => void;
  rivalProgress: number;
  setRivalProgress: (progress: number) => void;
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  isCompetitionActive: boolean;
  setIsCompetitionActive: (active: boolean) => void;
  userScore: number;
  setUserScore: (score: number) => void;
  rivalScore: number;
  setRivalScore: (score: number) => void;
  rivalClearTime: number;
  setRivalClearTime: (time: number) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
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

const STORAGE_KEY = 'learningRival_userProfile';

const getInitialProfile = (): UserProfile => {
  const storedProfile = localStorage.getItem(STORAGE_KEY);
  if (storedProfile) {
    const parsedProfile = JSON.parse(storedProfile);
    // Ensure xp is always a valid number
    if (typeof parsedProfile.xp !== 'number' || isNaN(parsedProfile.xp)) {
      parsedProfile.xp = 650;
    }
    return parsedProfile;
  }
  return {
    name: 'Learning Enthusiast',
    level: 1,
    competitions: 12,
    victories: 8,
    accuracy: 85,
    streak: 5,
    xp: 650
  };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [problemCount, setProblemCount] = useState<number>(10);
  const [timePerProblem, setTimePerProblem] = useState<number>(60);
  const [currentProblem, setCurrentProblem] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<number>(0);
  const [rivalProgress, setRivalProgress] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompetitionActive, setIsCompetitionActive] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [rivalScore, setRivalScore] = useState<number>(0);
  const [rivalClearTime, setRivalClearTime] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  const resetCompetition = () => {
    setCurrentProblem(0);
    setUserProgress(0);
    setRivalProgress(0);
    setElapsedTime(0);
    setIsCompetitionActive(false);
    setUserScore(0);
    setRivalScore(0);
    setRivalClearTime(0);
  };

  return (
    <AppContext.Provider
      value={{
        selectedCharacter,
        setSelectedCharacter,
        problemCount,
        setProblemCount,
        timePerProblem,
        setTimePerProblem,
        currentProblem,
        setCurrentProblem,
        userProgress,
        setUserProgress,
        rivalProgress,
        setRivalProgress,
        elapsedTime,
        setElapsedTime,
        isCompetitionActive,
        setIsCompetitionActive,
        userScore,
        setUserScore,
        rivalScore,
        setRivalScore,
        rivalClearTime,
        setRivalClearTime,
        userProfile,
        setUserProfile,
        resetCompetition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};