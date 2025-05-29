import { useEffect, useRef } from 'react';
import { Character } from '../types/characters';

interface UseRivalProgressProps {
  isActive: boolean;
  problemCount: number;
  timePerProblem: number;
  rival: Character;
  onProgressUpdate: (progress: number) => void;
  onComplete: (score: number, clearTime: number) => void;
}

export const useRivalProgress = ({
  isActive,
  problemCount,
  timePerProblem,
  rival,
  onProgressUpdate,
  onComplete
}: UseRivalProgressProps) => {
  const progressIntervalRef = useRef<number>();
  const currentProgressRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const cleanup = () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = undefined;
      }
    };

    if (!isActive) {
      cleanup();
      return;
    }

    // Reset progress when starting
    currentProgressRef.current = 0;
    completedRef.current = false;
    startTimeRef.current = Date.now();
    onProgressUpdate(0);

    const totalTime = problemCount * timePerProblem * 1000; // Convert to milliseconds
    const baseSpeed = rival.stats.speed / 10;
    const consistency = rival.stats.consistency / 10;
    const updateInterval = 100; // Update every 100ms for smoother progress
    
    progressIntervalRef.current = window.setInterval(() => {
      if (completedRef.current) {
        cleanup();
        return;
      }

      const elapsedTime = Date.now() - startTimeRef.current;
      const baseProgress = (elapsedTime / totalTime) * 100 * baseSpeed;
      const randomFactor = 1 + ((1 - consistency) * (Math.random() * 0.4 - 0.2));
      const newProgress = Math.min(100, baseProgress * randomFactor);
      
      currentProgressRef.current = newProgress;
      onProgressUpdate(newProgress);
      
      if (newProgress >= 100 && !completedRef.current) {
        completedRef.current = true;
        const clearTime = Math.round((Date.now() - startTimeRef.current) / 1000);
        const timeScore = Math.min(100, (totalTime / 1000 * 0.8) / clearTime * 100);
        const accuracyScore = rival.stats.accuracy * 10;
        const totalScore = Math.round((timeScore * 0.4) + (accuracyScore * 0.6));
        
        onComplete(totalScore, clearTime);
        cleanup();
      }
    }, updateInterval);
    
    return cleanup;
  }, [isActive, problemCount, timePerProblem, rival, onProgressUpdate, onComplete]);
};