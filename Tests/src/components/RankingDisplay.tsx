import React from 'react';
import { UserRanking } from '../types/ranking';
import { getUserLeague } from '../utils/leagueSystem';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';

interface RankingDisplayProps {
  rankings: UserRanking[];
  title: string;
  showTop?: number;
}

const RankingDisplay: React.FC<RankingDisplayProps> = ({ 
  rankings, 
  title, 
  showTop = 10 
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-blue-50 border-blue-200';
    
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const displayRankings = rankings.slice(0, showTop);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="space-y-2">
        {displayRankings.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
              getRankColor(user.rank, user.isCurrentUser || false)
            } ${user.isCurrentUser ? 'shadow-md scale-105' : ''}`}
          >
            <div className="flex items-center mr-4">
              {getRankIcon(user.rank)}
              <span className="ml-2 font-bold text-gray-700">#{user.rank}</span>
            </div>
            
            <div className="flex-1 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                {user.isCurrentUser ? (
                  <span className="text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </span>
                ) : (
                  <span className="text-lg">
                    {getUserLeague(user.xp).icon}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {user.name} {user.isCurrentUser && '(あなた)'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Level {user.level}</span>
                  <span>{user.league}</span>
                  <span>{user.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            
            {user.rank <= 3 && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.rank === 1 
                  ? 'bg-yellow-100 text-yellow-800'
                  : user.rank === 2 
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-amber-100 text-amber-800'
              }`}>
                {user.rank === 1 ? '👑 王者' : user.rank === 2 ? '🥈 準王者' : '🥉 3位'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingDisplay;