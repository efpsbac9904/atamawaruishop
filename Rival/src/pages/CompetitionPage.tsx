import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useRivalProgress } from '../hooks/useRivalProgress';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import { Flag, CheckCircle } from 'lucide-react';

const CompetitionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCharacter,
    problemCount,
    timePerProblem,
    setUserProgress,
    rivalProgress,
    setRivalProgress,
    elapsedTime,
    setElapsedTime,
    isCompetitionActive,
    setIsCompetitionActive,
    setUserScore,
    setRivalScore,
    setRivalClearTime,
  } = useAppContext();

  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>('');
  const [rivalFinished, setRivalFinished] = useState(false);
  const [rivalFinalScore, setRivalFinalScore] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    if (!selectedCharacter || !isCompetitionActive) {
      navigate('/');
    }
  }, [selectedCharacter, isCompetitionActive, navigate]);

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

  useRivalProgress({
    isActive: isCompetitionActive && !showCountdown,
    problemCount,
    timePerProblem,
    rival: selectedCharacter,
    onProgressUpdate: setRivalProgress,
    onComplete: (score, clearTime) => {
      setRivalScore(score);
      setRivalClearTime(clearTime);
      setRivalFinished(true);
      setRivalFinalScore(score);
    },
  });

  const handleComplete = () => {
    setIsCompetitionActive(false);
    setIsFinished(true);
    
    // Calculate accuracy
    const correctAnswersNum = Number(correctAnswers);
    const accuracy = (correctAnswersNum / problemCount) * 100;
    
    // Calculate time score
    const targetTime = problemCount * timePerProblem;
    const timeScore = Math.min(100, (targetTime * 0.8) / elapsedTime * 100);
    
    // Calculate total score (60% accuracy, 40% time)
    const totalScore = Math.round((accuracy * 0.6) + (timeScore * 0.4));
    
    setUserScore(totalScore);
    setUserProgress(100);

    // Only navigate to results if both user and rival have finished
    if (rivalFinished) {
      navigate('/results');
    }
  };

  const handleGiveUp = () => {
    setIsCompetitionActive(false);
    setUserScore(0);
    setIsFinished(true);
    
    if (rivalFinished) {
      navigate('/results');
    }
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

  if (!selectedCharacter) return null;

  if (showCountdown) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-12 text-center shadow-xl transform scale-150">
          <div className="text-6xl font-bold mb-4" style={{ color: selectedCharacter.color }}>
            {countdown}
          </div>
          <p className="text-gray-600">Get ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Competition in Progress</h1>
            <Timer 
              isRunning={isCompetitionActive && !isFinished} 
              elapsedTime={elapsedTime}
              onTimeUpdate={setElapsedTime}
            />
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="font-medium text-blue-700">You</span>
                </div>
                <h3 className="font-medium text-gray-700">Your Progress</h3>
              </div>
              <ProgressBar 
                progress={isFinished ? 100 : 0} 
                color="#3B82F6"
                label="Solving..."
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <img 
                  src={selectedCharacter.avatar}
                  alt={selectedCharacter.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <h3 className="font-medium text-gray-700">{selectedCharacter.name}'s Progress</h3>
              </div>
              <ProgressBar 
                progress={rivalProgress} 
                color={selectedCharacter.color}
                label={`${Math.round(rivalProgress)}% Complete`}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {!isFinished ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Solving Problems...</h2>
              <p className="text-gray-600 mb-6">
                Click "Complete" when you've finished solving all problems.
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
              <h2 className="text-xl font-medium text-gray-800 mb-4">Enter Correct Answers</h2>
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
                Submit Results
              </button>

              {rivalFinished && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-yellow-800">
                    {selectedCharacter.name} has finished! Submit your results to see who won.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Competition Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Total Problems:</span> {problemCount}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Time Elapsed:</span> {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Target Time:</span> {timePerProblem} sec/problem
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{selectedCharacter.name}'s Progress:</span> {Math.round(rivalProgress)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;