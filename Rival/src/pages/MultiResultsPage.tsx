import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiRival } from '../context/MultiRivalContext';
import { useAppContext } from '../context/AppContext';
import { calculateXPGain, calculateLevel } from '../utils/xpSystem';
import { ArrowLeft, Trophy, Medal, Crown, RefreshCw, Users } from 'lucide-react';

const MultiResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useAppContext();
  const {
    gameResults,
    selectedRivals,
    resetGame
  } = useMultiRival();

  useEffect(() => {
    if (!gameResults) {
      navigate('/multi-rival');
      return;
    }

    // Update user profile based on results
    const playerWon = gameResults.playerRank === 1;
    const topThree = gameResults.playerRank <= 3;
    
    // Calculate XP gains for multi-rival competition
    const gains = calculateXPGain(
      gameResults.playerStats.score,
      gameResults.playerStats.completionTime,
      selectedRivals.length * 60, // Approximate target time
      playerWon,
      selectedRivals.length
    );
    
    const totalXPGain = gains.reduce((sum, gain) => sum + gain.amount, 0);
    
    setUserProfile(prev => ({
      ...prev,
      competitions: prev.competitions + 1,
      victories: playerWon ? prev.victories + 1 : prev.victories,
      accuracy: Math.round((prev.accuracy + gameResults.playerStats.accuracy) / 2),
      streak: topThree ? prev.streak + 1 : 0,
      xp: prev.xp + totalXPGain,
      level: calculateLevel(prev.xp + totalXPGain)
    }));
  }, [gameResults, setUserProfile, navigate]);

  if (!gameResults) return null;

  const handleRematch = () => {
    resetGame();
    navigate('/multi-rival');
  };

  const handleBackToHome = () => {
    resetGame();
    navigate('/');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-gray-100 to-gray-300';
    }
  };

  const playerWon = gameResults.playerRank === 1;
  const topThree = gameResults.playerRank <= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={handleBackToHome}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to home
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`p-8 text-center ${
          playerWon 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
            : topThree 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-gradient-to-r from-gray-700 to-gray-900'
        }`}>
          <div className="flex justify-center mb-4">
            {getRankIcon(gameResults.playerRank)}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {playerWon 
              ? 'Victory!' 
              : topThree 
                ? 'Great Performance!' 
                : 'Keep Practicing!'}
          </h1>
          <p className="text-xl text-white">
            You ranked #{gameResults.playerRank} out of {gameResults.totalParticipants} competitors
          </p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Final Rankings</h2>
          
          <div className="space-y-3 mb-8">
            {gameResults.rankings.map((entry) => (
              <div
                key={entry.isPlayer ? 'player' : entry.character?.id}
                className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                  entry.isPlayer 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center mr-4">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex items-center flex-1">
                  {entry.isPlayer ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  ) : (
                    <img 
                      src={entry.character?.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {entry.name} {entry.isPlayer && '(You)'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Score: {entry.score}</span>
                      <span>
                        Time: {Math.floor(entry.completionTime / 60)}:{(entry.completionTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  entry.rank === 1 
                    ? 'bg-yellow-100 text-yellow-800'
                    : entry.rank <= 3 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  #{entry.rank}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Your Performance Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameResults.playerStats.score}</div>
                <div className="text-sm text-blue-700">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(gameResults.playerStats.completionTime / 60)}:{(gameResults.playerStats.completionTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-blue-700">Completion Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(gameResults.playerStats.accuracy)}%</div>
                <div className="text-sm text-blue-700">Accuracy</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-gray-700">
                {playerWon 
                  ? `Congratulations! You outperformed all ${selectedRivals.length} AI rivals. Your combination of speed and accuracy was excellent.`
                  : topThree 
                    ? `Great job finishing in the top 3! You competed well against ${selectedRivals.length} challenging AI rivals.`
                    : `You competed against ${selectedRivals.length} AI rivals. Focus on improving your speed and accuracy for better results next time.`
                }
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleRematch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Challenge Again
            </button>
            
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiResultsPage;