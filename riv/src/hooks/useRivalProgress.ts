import { useEffect, useRef } from 'react';
import { Character } from '../types/characters';

interface UseRivalProgressProps {
  isActive: boolean;
  problemCount: number;
  timePerProblem: number;
  rival: Character | null;
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
    // Reset progress when competition starts
    if (isActive) {
      currentProgressRef.current = 0;
      completedRef.current = false;
      startTimeRef.current = Date.now();
      onProgressUpdate(0);
    }
  }, [isActive, onProgressUpdate]);

  useEffect(() => {
    if (!isActive || !rival) return;

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Calculate total competition time
    const totalTime = problemCount * timePerProblem;
    
    // Calculate rival's speed based on their stats
    // Speed stat determines how quickly they progress
    const baseSpeed = rival.stats.speed / 10; // Convert to 0-1 scale
    
    // Consistency affects how steady their progress is
    const consistency = rival.stats.consistency / 10; // Convert to 0-1 scale
    
    // Calculate update interval (more frequent updates for more consistent rivals)
    const updateInterval = Math.max(50, 200 - consistency * 150);
    
    // Calculate progress increment per update
    // Higher consistency means more predictable increments
    const baseIncrement = (100 / (totalTime * 1000 / updateInterval)) * baseSpeed;
    
    progressIntervalRef.current = window.setInterval(() => {
      if (completedRef.current) {
        clearInterval(progressIntervalRef.current);
        return;
      }

      // Add some randomness based on inverse of consistency
      const randomFactor = 1 + ((1 - consistency) * (Math.random() * 0.4 - 0.2));
      
      // Calculate actual increment for this interval
      const increment = baseIncrement * randomFactor;
      
      // Update progress
      currentProgressRef.current = Math.min(100, currentProgressRef.current + increment);
      onProgressUpdate(currentProgressRef.current);
      
      // Check if rival completed all problems
      if (currentProgressRef.current >= 100 && !completedRef.current) {
        completedRef.current = true;
        
        // Calculate clear time
        const clearTime = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        // Calculate rival's score based on time and accuracy
        const timeScore = Math.min(100, (totalTime * 0.8) / clearTime * 100);
        const accuracyScore = rival.stats.accuracy * 10; // Convert to percentage
        
        // Combine time and accuracy for total score (weighted 40/60)
        const totalScore = Math.round((timeScore * 0.4) + (accuracyScore * 0.6));
        
        onComplete(totalScore, clearTime);
        clearInterval(progressIntervalRef.current);
      }
    }, updateInterval);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isActive, problemCount, timePerProblem, rival, onProgressUpdate, onComplete]);
};