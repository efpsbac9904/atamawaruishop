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
    selectedRivals,
    problemCount,
    timePerProblem,
    setUserProgress,
    rivalsProgress,
    setRivalsProgress,
    elapsedTime,
    setElapsedTime,
    isCompetitionActive,
    setIsCompetitionActive,
    setUserScore,
  } = useAppContext();

  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>('');
  const [rivalFinished, setRivalFinished] = useState<{[key: string]: boolean}>({});
  const [rivalFinalScores, setRivalFinalScores] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (selectedRivals.length === 0 || !isCompetitionActive) {
      navigate('/');
    }
  }, [selectedRivals, isCompetitionActive, navigate]);

  const handleRivalProgressUpdate = (rivalId: string, progress: number) => {
    setRivalsProgress(prev => {
      const existingRivalIndex = prev.findIndex(r => r.id === rivalId);
      if (existingRivalIndex >= 0) {
        return prev.map((rival, index) => 
          index === existingRivalIndex ? { ...rival, progress } : rival
        );
      }
      return [...prev, { id: rivalId, progress }];
    });
  };

  // Set up progress tracking for each rival
  selectedRivals.forEach(rival => {
    useRivalProgress({
      isActive: isCompetitionActive,
      problemCount,
      timePerProblem,
      rival,
      onProgressUpdate: (progress) => handleRivalProgressUpdate(rival.id, progress),
      onComplete: (score) => {
        setRivalFinished(prev => ({ ...prev, [rival.id]: true }));
        setRivalFinalScores(prev => ({ ...prev, [rival.id]: score }));
      },
    });
  });

  const handleComplete = () => {
    setIsCompetitionActive(false);
    setIsFinished(true);
    
    const correctAnswersNum = Number(correctAnswers);
    const accuracy = (correctAnswersNum / problemCount) * 100;
    const targetTime = problemCount * timePerProblem;
    const timeScore = Math.min(100, (targetTime * 0.8) / elapsedTime * 100);
    const totalScore = Math.round((accuracy * 0.6) + (timeScore * 0.4));
    
    setUserScore(totalScore);
    setUserProgress(100);

    const allRivalsFinished = selectedRivals.every(rival => rivalFinished[rival.id]);
    if (allRivalsFinished) {
      navigate('/results');
    }
  };

  const handleGiveUp = () => {
    setIsCompetitionActive(false);
    setUserScore(0);
    setIsFinished(true);
    
    const allRivalsFinished = selectedRivals.every(rival => rivalFinished[rival.id]);
    if (allRivalsFinished) {
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
          
          <div className="mt-4 space-y-4">
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
            
            {selectedRivals.map(rival => {
              const rivalProgress = rivalsProgress.find(r => r.id === rival.id)?.progress || 0;
              return (
                <div key={rival.id}>
                  <div className="flex items-center mb-2">
                    <img 
                      src={rival.avatar}
                      alt={rival.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <h3 className="font-medium text-gray-700">{rival.name}'s Progress</h3>
                  </div>
                  <ProgressBar 
                    progress={rivalProgress} 
                    color={rival.color}
                    label={`${Math.round(rivalProgress)}% Complete`}
                  />
                </div>
              );
            })}
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

              {Object.values(rivalFinished).some(finished => finished) && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-yellow-800">
                    {selectedRivals.filter(rival => rivalFinished[rival.id]).length === selectedRivals.length
                      ? 'All rivals have finished! Submit your results to see who won.'
                      : 'Some rivals have finished! Submit your results when ready.'}
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
                  <span className="font-medium">Rivals:</span> {selectedRivals.length}
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