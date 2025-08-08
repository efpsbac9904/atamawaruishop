import React from 'react';
import { RivalProgress } from '../types/multiRival';
import ProgressBar from './ProgressBar';
import { User } from 'lucide-react';

interface MultiRivalProgressProps {
  playerProgress: number;
  rivalProgresses: RivalProgress[];
  playerName: string;
}

const MultiRivalProgress: React.FC<MultiRivalProgressProps> = ({
  playerProgress,
  rivalProgresses,
  playerName
}) => {
  // Sort by progress (descending) for ranking display
  const sortedProgresses = [...rivalProgresses].sort((a, b) => b.progress - a.progress);
  const playerRank = sortedProgresses.filter(rival => rival.progress > playerProgress).length + 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Competition Progress</h2>
        <div className="text-sm text-gray-600">
          Your Rank: <span className="font-bold text-blue-600">#{playerRank}</span> / {rivalProgresses.length + 1}
        </div>
      </div>

      <div className="space-y-4">
        {/* Player Progress */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{playerName} (You)</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600 mr-2">Rank #{playerRank}</span>
                {playerProgress >= 100 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
          <ProgressBar 
            progress={playerProgress} 
            color="#3B82F6"
            label={`${Math.round(playerProgress)}% Complete`}
          />
        </div>

        {/* Rival Progresses */}
        {sortedProgresses.map((rival, index) => (
          <div 
            key={rival.character.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
          >
            <div className="flex items-center mb-2">
              <img 
                src={rival.character.avatar}
                alt={rival.character.name}
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{rival.character.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600 mr-2">
                    Rank #{index + (playerProgress > rival.progress ? 2 : 1)}
                  </span>
                  {rival.isFinished && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: rival.character.color }}>
                  {Math.round(rival.progress)}%
                </div>
                {rival.isFinished && rival.completedAt && (
                  <div className="text-xs text-gray-500">
                    {Math.floor(rival.completedAt / 60)}:{(rival.completedAt % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
            <ProgressBar 
              progress={rival.progress} 
              color={rival.character.color}
              label=""
              animated={!rival.isFinished}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiRivalProgress;