import { useEffect, useRef, useState } from 'react';
import { Character } from '../types/characters';
import { RivalProgress } from '../types/multiRival';

interface UseMultiRivalProgressProps {
  isActive: boolean;
  problemCount: number;
  timePerProblem: number;
  rivals: Character[];
  onProgressUpdate: (rivalProgresses: RivalProgress[]) => void;
  onRivalComplete: (rivalId: string, score: number, clearTime: number) => void;
}

export const useMultiRivalProgress = ({
  isActive,
  problemCount,
  timePerProblem,
  rivals,
  onProgressUpdate,
  onRivalComplete
}: UseMultiRivalProgressProps) => {
  const progressIntervalsRef = useRef<Map<string, number>>(new Map());
  const rivalProgressesRef = useRef<Map<string, RivalProgress>>(new Map());
  const startTimeRef = useRef<number>(0);
  const rivalStatesRef = useRef<Map<string, {
    baseSpeed: number;
    currentMomentum: number;
    lastSpeedChange: number;
    streakCount: number;
    hasSlowedDown: boolean;
    finalSprintTriggered: boolean;
  }>>(new Map());

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      
      // Initialize rival progresses and states
      const initialProgresses = new Map<string, RivalProgress>();
      const initialStates = new Map();
      
      rivals.forEach(rival => {
        initialProgresses.set(rival.id, {
          character: {
            id: rival.id,
            name: rival.name,
            avatar: rival.avatar,
            color: rival.color,
            stats: rival.stats
          },
          progress: 0,
          score: 0,
          isFinished: false
        });

        // Initialize each rival's unique behavioral state
        initialStates.set(rival.id, {
          baseSpeed: (rival.stats.speed / 10) * (0.8 + Math.random() * 0.4), // ±20% variation
          currentMomentum: 1.0,
          lastSpeedChange: 0,
          streakCount: 0,
          hasSlowedDown: false,
          finalSprintTriggered: false
        });
      });
      
      rivalProgressesRef.current = initialProgresses;
      rivalStatesRef.current = initialStates;
      onProgressUpdate(Array.from(initialProgresses.values()));
    }
  }, [isActive, rivals, onProgressUpdate]);

  useEffect(() => {
    if (!isActive || rivals.length === 0) return;

    // Clear existing intervals
    progressIntervalsRef.current.forEach(interval => clearInterval(interval));
    progressIntervalsRef.current.clear();

    const totalTime = problemCount * timePerProblem;

    rivals.forEach(rival => {
      const consistency = rival.stats.consistency / 10;
      const accuracy = rival.stats.accuracy / 10;
      const updateInterval = Math.max(100, 300 - consistency * 200);
      
      const rivalState = rivalStatesRef.current.get(rival.id)!;
      const baseIncrement = (100 / (totalTime * 1000 / updateInterval)) * rivalState.baseSpeed;

      const intervalId = window.setInterval(() => {
        const currentProgress = rivalProgressesRef.current.get(rival.id);
        if (!currentProgress || currentProgress.isFinished) {
          const interval = progressIntervalsRef.current.get(rival.id);
          if (interval) {
            clearInterval(interval);
            progressIntervalsRef.current.delete(rival.id);
          }
          return;
        }

        const currentTime = Date.now() - startTimeRef.current;
        const progressPercent = currentProgress.progress;
        
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
          // Momentum system
          if (currentTime - rivalState.lastSpeedChange > 5000) { // Every 5 seconds
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
          if (consistency < 0.7 && !rivalState.hasSlowedDown && Math.random() < 0.15) {
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
        const newProgress = Math.min(100, currentProgress.progress + finalIncrement);
        
        const updatedProgress: RivalProgress = {
          ...currentProgress,
          progress: newProgress
        };

        // Check if rival completed
        if (newProgress >= 100 && !currentProgress.isFinished) {
          const clearTime = Math.round((Date.now() - startTimeRef.current) / 1000);
          
          // Score calculation with randomness
          const timeScore = Math.min(100, (totalTime * 0.8) / clearTime * 100);
          const baseAccuracyScore = accuracy * 100;
          
          // Add some randomness to accuracy based on consistency
          const accuracyVariation = (1 - consistency) * (Math.random() * 20 - 10);
          const finalAccuracyScore = Math.max(0, Math.min(100, baseAccuracyScore + accuracyVariation));
          
          const totalScore = Math.round((timeScore * 0.4) + (finalAccuracyScore * 0.6));
          
          updatedProgress.isFinished = true;
          updatedProgress.score = totalScore;
          updatedProgress.completedAt = clearTime;
          
          onRivalComplete(rival.id, totalScore, clearTime);
          
          const interval = progressIntervalsRef.current.get(rival.id);
          if (interval) {
            clearInterval(interval);
            progressIntervalsRef.current.delete(rival.id);
          }
        }

        rivalProgressesRef.current.set(rival.id, updatedProgress);
        onProgressUpdate(Array.from(rivalProgressesRef.current.values()));
      }, updateInterval);

      progressIntervalsRef.current.set(rival.id, intervalId);
    });

    return () => {
      progressIntervalsRef.current.forEach(interval => clearInterval(interval));
      progressIntervalsRef.current.clear();
    };
  }, [isActive, problemCount, timePerProblem, rivals, onProgressUpdate, onRivalComplete]);
};