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
  const rivalStateRef = useRef<{
    baseSpeed: number;
    currentMomentum: number;
    lastSpeedChange: number;
    streakCount: number;
    hasSlowedDown: boolean;
    finalSprintTriggered: boolean;
  }>();

  useEffect(() => {
    // Reset progress when competition starts
    if (isActive && rival) {
      currentProgressRef.current = 0;
      completedRef.current = false;
      startTimeRef.current = Date.now();
      
      // Initialize rival's behavioral state with randomness
      rivalStateRef.current = {
        baseSpeed: (rival.stats.speed / 10) * (0.8 + Math.random() * 0.4), // ±20% variation
        currentMomentum: 1.0,
        lastSpeedChange: 0,
        streakCount: 0,
        hasSlowedDown: false,
        finalSprintTriggered: false
      };
      
      onProgressUpdate(0);
    }
  }, [isActive, rival, onProgressUpdate]);

  useEffect(() => {
    if (!isActive || !rival || !rivalStateRef.current) return;

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Calculate total competition time
    const totalTime = problemCount * timePerProblem;
    
    // Get rival stats
    const consistency = rival.stats.consistency / 10;
    const accuracy = rival.stats.accuracy / 10;
    
    // Calculate update interval (more frequent updates for more consistent rivals)
    const updateInterval = Math.max(100, 300 - consistency * 200);
    
    // Calculate base progress increment per update
    const rivalState = rivalStateRef.current;
    const baseIncrement = (100 / (totalTime * 1000 / updateInterval)) * rivalState.baseSpeed;
    
    progressIntervalRef.current = window.setInterval(() => {
      if (completedRef.current) {
        clearInterval(progressIntervalRef.current);
        return;
      }

      const currentTime = Date.now() - startTimeRef.current;
      const progressPercent = currentProgressRef.current;
      
      // Dynamic behavior based on progress and character traits
      let speedMultiplier = rivalState.currentMomentum;
      
      // Early game: Some characters start slow, others start fast
      if (progressPercent < 20) {
        if (rival.stats.speed > 8) {
          speedMultiplier *= 1.2; // Fast starters
        } else if (rival.stats.consistency > 8) {
          speedMultiplier *= 0.8; // Slow but steady starters
        }
      }
      
      // Mid game: Momentum changes and streaks
      if (progressPercent >= 20 && progressPercent < 80) {
        // Momentum system - changes every 5-8 seconds
        if (currentTime - rivalState.lastSpeedChange > 5000 + Math.random() * 3000) {
          const momentumChange = (Math.random() - 0.5) * 0.3;
          rivalState.currentMomentum = Math.max(0.5, Math.min(1.5, rivalState.currentMomentum + momentumChange));
          rivalState.lastSpeedChange = currentTime;
          
          // Streak system for high-accuracy characters
          if (accuracy > 0.8 && Math.random() < 0.3) {
            rivalState.streakCount++;
            if (rivalState.streakCount >= 3) {
              speedMultiplier *= 1.3; // Hot streak bonus
            }
          } else if (Math.random() < 0.2) {
            rivalState.streakCount = 0; // Break streak
          }
        }
        
        // Occasional slowdowns for less consistent characters
        if (consistency < 0.7 && !rivalState.hasSlowedDown && Math.random() < 0.1) {
          speedMultiplier *= 0.4;
          rivalState.hasSlowedDown = true;
          setTimeout(() => {
            rivalState.hasSlowedDown = false;
          }, 3000 + Math.random() * 2000);
        }
      }
      
      // End game: Final sprint or choke
      if (progressPercent >= 80 && !rivalState.finalSprintTriggered) {
        rivalState.finalSprintTriggered = true;
        if (rival.stats.speed > 7 && Math.random() < 0.6) {
          speedMultiplier *= 1.4; // Final sprint
        } else if (consistency < 0.6 && Math.random() < 0.4) {
          speedMultiplier *= 0.6; // Choke under pressure
        }
      }
      
      // Base randomness influenced by consistency
      const randomVariation = 1 + ((1 - consistency) * (Math.random() * 0.6 - 0.3));
      
      // Calculate final increment
      const finalIncrement = baseIncrement * speedMultiplier * randomVariation;
      
      // Update progress
      currentProgressRef.current = Math.min(100, currentProgressRef.current + finalIncrement);
      onProgressUpdate(currentProgressRef.current);
      
      // Check if rival completed all problems
      if (currentProgressRef.current >= 100 && !completedRef.current) {
        completedRef.current = true;
        
        // Calculate clear time
        const clearTime = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        // Calculate rival's score with randomness
        const timeScore = Math.min(100, (totalTime * 0.8) / clearTime * 100);
        const baseAccuracyScore = accuracy * 100;
        
        // Add some randomness to accuracy based on consistency
        const accuracyVariation = (1 - consistency) * (Math.random() * 20 - 10);
        const finalAccuracyScore = Math.max(0, Math.min(100, baseAccuracyScore + accuracyVariation));
        
        const totalScore = Math.round((timeScore * 0.4) + (finalAccuracyScore * 0.6));
        
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