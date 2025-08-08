import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRanking, RankingData } from '../types/ranking';
import { generateMockRankings } from '../utils/mockRankings';
import { getProgressToNextLevel } from '../utils/xpSystem';
import { getUserLeague, getLeagueProgress, leagues } from '../utils/leagueSystem';
import RankingDisplay from '../components/RankingDisplay';
import { ArrowLeft, TrendingUp, Users, Target, Trophy, Crown } from 'lucide-react';

const RankingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [activeTab, setActiveTab] = useState<'global' | 'nearby'>('global');

  useEffect(() => {
    // Generate mock rankings based on user's current XP
    const allRankings = generateMockRankings(userProfile.xp, userProfile.name);
    
    const currentUser = allRankings.find(r => r.isCurrentUser)!;
    const userRank = currentUser.rank;
    const userLeague = getUserLeague(userProfile.xp);
    
    // Top 50 rankings
    const topRankings = allRankings.slice(0, 50);
    
    // Nearby rankings (±5 positions around user)
    const nearbyStart = Math.max(0, userRank - 6);
    const nearbyEnd = Math.min(allRankings.length, userRank + 5);
    const nearbyRankings = allRankings.slice(nearbyStart, nearbyEnd);
    
    // League rankings (same league users)
    const leagueRankings = allRankings.filter(user => user.league === userLeague.name).slice(0, 20);
    
    setRankingData({
      currentUser,
      topRankings,
      nearbyRankings,
      totalUsers: allRankings.length,
      currentLeague: userLeague.name,
      leagueRankings
    });
  }, [userProfile]);

  if (!rankingData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { currentUser } = rankingData;
  const userLeague = getUserLeague(currentUser.xp);
  const levelProgress = getProgressToNextLevel(currentUser.xp);
  const leagueProgress = getLeagueProgress(currentUser.xp);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        ホームに戻る
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ランキング</h1>
        <p className="text-gray-600">
          全体のランキングを確認して、さらなる高みを目指しましょう！
        </p>
      </div>

      {/* User Stats Card */}
      <div 
        className="rounded-lg p-6 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${userLeague.color}dd, ${userLeague.color}aa)` 
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{userLeague.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-white/80">{userLeague.name}リーグ • Level {currentUser.level}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">#{currentUser.rank}</div>
            <div className="text-white/80">/ {rankingData.totalUsers}人中</div>
            <div className="text-sm text-white/70 mt-1">
              リーグ内 #{currentUser.leagueRank}位
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{currentUser.xp.toLocaleString()}</div>
            <div className="text-sm text-white/80">総XP</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">
              {leagueProgress.needed > 0 ? leagueProgress.current : 'MAX'}
            </div>
            <div className="text-sm text-white/80">
              {leagueProgress.needed > 0 ? '次のリーグまで' : '最高リーグ'}
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Math.round(leagueProgress.percentage)}%</div>
            <div className="text-sm text-white/80">リーグ進捗</div>
          </div>
        </div>
        
        {/* League Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${leagueProgress.percentage}%` }}
          ></div>
        </div>
        
        {leagueProgress.needed > 0 && (
          <div className="text-center mt-2 text-sm text-white/80">
            次のリーグ（{leagues[leagues.findIndex(l => l.name === userLeague.name) + 1]?.name}）まで {leagueProgress.needed - leagueProgress.current} XP
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'global'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Trophy className="h-5 w-5 mr-2" />
          グローバルランキング
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'nearby'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          周辺ランキング
        </button>
        <button
          onClick={() => setActiveTab('league' as any)}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            (activeTab as any) === 'league'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Crown className="h-5 w-5 mr-2" />
          {userLeague.name}リーグ
        </button>
      </div>

      {/* Rankings Display */}
      {activeTab === 'global' && (
        <RankingDisplay
          rankings={rankingData.topRankings}
          title="グローバルランキング (Top 50)"
          showTop={50}
        />
      )}
      
      {activeTab === 'nearby' && (
        <RankingDisplay
          rankings={rankingData.nearbyRankings}
          title="あなたの周辺ランキング"
          showTop={15}
        />
      )}
      
      {(activeTab as any) === 'league' && (
        <RankingDisplay
          rankings={rankingData.leagueRankings}
          title={`${userLeague.name}リーグランキング`}
          showTop={20}
        />
      )}

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <div className="flex items-center mb-4">
          <Target className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-800">次の目標</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">
              {leagueProgress.needed > 0 ? 'リーグ昇格まで' : '最高リーグ到達！'}
            </h4>
            {leagueProgress.needed > 0 ? (
              <>
                <p className="text-2xl font-bold text-green-600">
                  {leagueProgress.needed - leagueProgress.current} XP
                </p>
                <p className="text-sm text-gray-600">
                  あと{Math.ceil((leagueProgress.needed - leagueProgress.current) / 50)}回の競技で昇格！
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-purple-600">
                🎉 イモータルリーグ到達済み！
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">ランクアップまで</h4>
            {currentUser.rank > 1 ? (
              <>
                <p className="text-2xl font-bold text-blue-600">
                  {(rankingData.topRankings.find(u => u.rank === currentUser.rank - 1)?.xp || 0) - currentUser.xp} XP
                </p>
                <p className="text-sm text-gray-600">
                  #{currentUser.rank - 1}位まであと少し！
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-yellow-600">
                🎉 あなたが1位です！
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* League System Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">リーグシステム</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {leagues.map((league, index) => (
            <div 
              key={league.name}
              className={`p-3 rounded-lg border-2 transition-all ${
                league.name === userLeague.name 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{league.icon}</div>
                <div className="font-medium text-sm" style={{ color: league.color }}>
                  {league.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {league.minXP.toLocaleString()}
                  {league.maxXP !== Infinity ? ` - ${league.maxXP.toLocaleString()}` : '+'} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;