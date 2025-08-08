import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiRival } from '../context/MultiRivalContext';
import { useAppContext } from '../context/AppContext';
import MultiRivalSelector from '../components/MultiRivalSelector';
import { ArrowLeft, Play, Settings, Clock, ListChecks } from 'lucide-react';

const MultiRivalPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const {
    selectedRivals,
    problemCount,
    setProblemCount,
    timePerProblem,
    setTimePerProblem,
    setIsGameActive,
    resetGame
  } = useMultiRival();

  const [showSettings, setShowSettings] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState(timePerProblem.toString());

  const handleStartCompetition = () => {
    if (selectedRivals.length === 0) return;
    
    resetGame();
    setIsGameActive(true);
    navigate('/multi-competition');
  };

  const handleProblemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 50) {
      setProblemCount(value);
    }
  };

  const handleTimePresetClick = (seconds: number) => {
    setTimePerProblem(seconds);
    setIsCustomTime(false);
  };

  const handleCustomTimeClick = () => {
    setIsCustomTime(true);
    setCustomTime(timePerProblem.toString());
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTime(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setTimePerProblem(numValue);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to home
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Rival Challenge</h1>
        <p className="text-gray-600">
          Compete against multiple AI rivals simultaneously and see where you rank!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MultiRivalSelector />
        </div>

        <div className="space-y-6">
          {/* Settings Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Game Settings</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {showSettings && (
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <ListChecks className="w-4 h-4 mr-2 text-gray-700" />
                    <label className="text-sm font-medium text-gray-700">
                      Number of Problems
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={problemCount}
                      onChange={handleProblemCountChange}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={problemCount}
                      onChange={handleProblemCountChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-2 text-gray-700" />
                    <label className="text-sm font-medium text-gray-700">
                      Time per Problem
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {[30, 60, 90, 120].map((seconds) => (
                      <button
                        key={seconds}
                        onClick={() => handleTimePresetClick(seconds)}
                        className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
                          timePerProblem === seconds && !isCustomTime
                            ? 'bg-blue-100 text-blue-700 border-blue-300 border'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleCustomTimeClick}
                    className={`text-xs ${
                      isCustomTime ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {isCustomTime ? (
                      <div className="flex items-center">
                        <span className="mr-1">Custom:</span>
                        <input
                          type="number"
                          min="5"
                          value={customTime}
                          onChange={handleCustomTimeChange}
                          className="w-12 px-1 py-0.5 border border-blue-300 rounded text-xs"
                          autoFocus
                        />
                        <span className="ml-1">s</span>
                      </div>
                    ) : (
                      'Custom time'
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
              <h4 className="font-medium text-blue-800 text-sm mb-1">Competition Summary</h4>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• {problemCount} problems to solve</li>
                <li>• {timePerProblem} seconds per problem</li>
                <li>• {selectedRivals.length} AI rivals selected</li>
                <li>• Total time: {Math.floor((problemCount * timePerProblem) / 60)}m {(problemCount * timePerProblem) % 60}s</li>
              </ul>
            </div>

            <button
              onClick={handleStartCompetition}
              disabled={selectedRivals.length === 0}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedRivals.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Multi-Rival Challenge
            </button>
          </div>

          {/* Player Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Competitions</span>
                <span className="font-medium">{userProfile.competitions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Victories</span>
                <span className="font-medium">{userProfile.victories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="font-medium">
                  {userProfile.competitions > 0 
                    ? Math.round((userProfile.victories / userProfile.competitions) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-medium">{userProfile.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRivalPage;