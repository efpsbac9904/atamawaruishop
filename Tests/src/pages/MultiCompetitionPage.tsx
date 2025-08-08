import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiRival } from '../context/MultiRivalContext';
import { useAppContext } from '../context/AppContext';
import { useMultiRivalProgress } from '../hooks/useMultiRivalProgress';
import MultiRivalProgress from '../components/MultiRivalProgress';
import Timer from '../components/Timer';
import { Flag, CheckCircle } from 'lucide-react';
import { RivalProgress, MultiRivalResults, RankingEntry } from '../types/multiRival';

const MultiCompetitionPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const {
    selectedRivals,
    problemCount,
    timePerProblem,
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
    setGameResults,
    resetGame
  } = useMultiRival();

  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>('');
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(true);
  const [finishedRivals, setFinishedRivals] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedRivals.length === 0 || !isGameActive) {
      navigate('/multi-rival');
    }
  }, [selectedRivals, isGameActive, navigate]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
    }
  }, [countdown, showCountdown]);

  const handleRivalComplete = (rivalId: string, score: number, clearTime: number) => {
    setFinishedRivals(prev => new Set([...prev, rivalId]));
  };

  useMultiRivalProgress({
    isActive: isGameActive && !showCountdown,
    problemCount,
    timePerProblem,
    rivals: selectedRivals,
    onProgressUpdate: setRivalProgresses,
    onRivalComplete: handleRivalComplete,
  });

  const handleComplete = () => {
    setIsGameActive(false);
    setIsFinished(true);
    
    const correctAnswersNum = Number(correctAnswers);
    const accuracy = (correctAnswersNum / problemCount) * 100;
    const targetTime = problemCount * timePerProblem;
    const timeScore = Math.min(100, (targetTime * 0.8) / elapsedTime * 100);
    const totalScore = Math.round((accuracy * 0.6) + (timeScore * 0.4));
    
    setPlayerScore(totalScore);
    setPlayerProgress(100);

    // Calculate final results
    const allParticipants: RankingEntry[] = [
      {
        rank: 0, // Will be calculated
        name: userProfile.name,
        score: totalScore,
        completionTime: elapsedTime,
        isPlayer: true
      },
      ...rivalProgresses.map(rival => ({
        rank: 0, // Will be calculated
        name: rival.character.name,
        score: rival.score,
        completionTime: rival.completedAt || elapsedTime + 60, // Penalty for incomplete
        isPlayer: false,
        character: rival.character
      }))
    ];

    // Sort by score (descending), then by completion time (ascending)
    allParticipants.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.completionTime - b.completionTime;
    });

    // Assign ranks
    allParticipants.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    const playerRank = allParticipants.find(p => p.isPlayer)?.rank || allParticipants.length;

    const results: MultiRivalResults = {
      playerRank,
      totalParticipants: allParticipants.length,
      rankings: allParticipants,
      playerStats: {
        score: totalScore,
        completionTime: elapsedTime,
        accuracy
      }
    };

    setGameResults(results);
    navigate('/multi-results');
  };

  const handleGiveUp = () => {
    setIsGameActive(false);
    setPlayerScore(0);
    setIsFinished(true);
    
    // Create results with 0 score
    const allParticipants: RankingEntry[] = [
      {
        rank: rivalProgresses.length + 1,
        name: userProfile.name,
        score: 0,
        completionTime: elapsedTime,
        isPlayer: true
      },
      ...rivalProgresses.map((rival, index) => ({
        rank: index + 1,
        name: rival.character.name,
        score: rival.score,
        completionTime: rival.completedAt || elapsedTime,
        isPlayer: false,
        character: rival.character
      }))
    ];

    const results: MultiRivalResults = {
      playerRank: allParticipants.length,
      totalParticipants: allParticipants.length,
      rankings: allParticipants,
      playerStats: {
        score: 0,
        completionTime: elapsedTime,
        accuracy: 0
      }
    };

    setGameResults(results);
    navigate('/multi-results');
  };

  const handleCorrectAnswersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (value === '') {
      setCorrectAnswers('');
    } else if (!isNaN(numValue) && numValue >= 0 && numValue <= problemCount) {
      setCorrectAnswers(numValue);
    }
  };

  if (selectedRivals.length === 0) return null;

  if (showCountdown) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-12 text-center shadow-xl transform scale-150">
          <div className="text-6xl font-bold mb-4 text-blue-600">
            {countdown}
          </div>
          <p className="text-gray-600">Get ready to compete against {selectedRivals.length} rivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Multi-Rival Competition</h1>
            <Timer 
              isRunning={isGameActive && !isFinished} 
              elapsedTime={elapsedTime}
              onTimeUpdate={setElapsedTime}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Competing against {selectedRivals.length} AI rivals • {problemCount} problems • {timePerProblem}s per problem
          </div>
        </div>
        
        <div className="p-6">
          {!isFinished ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Solving Problems...</h2>
              <p className="text-gray-600 mb-6">
                Work through your problems and click "Complete" when you're finished. Watch your ranking change in real-time!
              </p>
              
              <div className="flex justify-between">
                <button
                  onClick={handleGiveUp}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Give Up
                </button>
                
                <button
                  onClick={() => setIsFinished(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center transition-colors"
                >
                  Complete
                  <CheckCircle className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Enter Your Results</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many problems did you solve correctly?
                </label>
                <input
                  type="number"
                  min="0"
                  max={problemCount}
                  value={correctAnswers}
                  onChange={handleCorrectAnswersChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter a number between 0 and ${problemCount}`}
                />
              </div>
              
              <button
                onClick={handleComplete}
                disabled={correctAnswers === ''}
                className={`w-full py-3 rounded-md font-medium text-white ${
                  correctAnswers !== '' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Results & See Rankings
              </button>
            </div>
          )}
        </div>
      </div>

      <MultiRivalProgress
        playerProgress={isFinished ? 100 : 0}
        rivalProgresses={rivalProgresses}
        playerName={userProfile.name}
      />
    </div>
  );
};

export default MultiCompetitionPage;