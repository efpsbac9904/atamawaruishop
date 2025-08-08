import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getProgressToNextLevel } from '../utils/xpSystem';
import { User, Medal, Trophy, Award, Edit2, Check, X } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { userProfile, setUserProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    if (editedProfile.name.trim()) {
      setUserProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Handle numeric fields
    if (['competitions', 'victories', 'accuracy', 'streak', 'xp'].includes(name)) {
      parsedValue = Math.max(0, parseInt(value) || 0);
      
      // Additional constraints
      if (name === 'accuracy') {
        parsedValue = Math.min(100, parsedValue);
      } else if (name === 'streak') {
        parsedValue = Math.min(7, parsedValue);
      }
    }

    setEditedProfile(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const levelProgress = getProgressToNextLevel(userProfile.xp);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-4 shadow-md">
              <User className="h-10 w-10 text-blue-500" />
            </div>
            {isEditing ? (
              <div className="flex-1">
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded border border-white bg-white/10 text-white placeholder-white/70"
                  placeholder="Enter your name"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-blue-100">Level {userProfile.level}</p>
                <p className="text-blue-200 text-sm">{userProfile.xp.toLocaleString()} XP</p>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-white hover:text-green-200 transition-colors"
                  title="Save"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-white hover:text-red-200 transition-colors"
                  title="Cancel"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-white hover:text-blue-200 transition-colors"
                title="Edit profile"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Level Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Level {userProfile.level} Progress
            </span>
            <span className="text-sm text-gray-500">
              {levelProgress.current} / {levelProgress.needed} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            次のレベルまで {levelProgress.needed - levelProgress.current} XP
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Your Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {isEditing ? (
              <>
                <div className="bg-blue-50 rounded-lg p-3">
                  <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <input
                    type="number"
                    name="competitions"
                    value={editedProfile.competitions}
                    onChange={handleChange}
                    className="w-full text-center border border-gray-300 rounded px-2 py-1"
                    min="0"
                  />
                  <div className="text-xs text-gray-500">Competitions</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <input
                    type="number"
                    name="victories"
                    value={editedProfile.victories}
                    onChange={handleChange}
                    className="w-full text-center border border-gray-300 rounded px-2 py-1"
                    min="0"
                  />
                  <div className="text-xs text-gray-500">Victories</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <Medal className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <input
                    type="number"
                    name="accuracy"
                    value={editedProfile.accuracy}
                    onChange={handleChange}
                    className="w-full text-center border border-gray-300 rounded px-2 py-1"
                    min="0"
                    max="100"
                  />
                  <div className="text-xs text-gray-500">Accuracy %</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 rounded-lg p-3">
                  <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{userProfile.competitions}</div>
                  <div className="text-xs text-gray-500">Competitions</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{userProfile.victories}</div>
                  <div className="text-xs text-gray-500">Victories</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <Medal className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{userProfile.accuracy}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
              </>
            )}
          </div>
          
          {/* XP Display */}
          <div className="mt-4">
            {isEditing ? (
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <Medal className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <input
                  type="number"
                  name="xp"
                  value={editedProfile.xp}
                  onChange={handleChange}
                  className="w-full text-center border border-gray-300 rounded px-2 py-1"
                  min="0"
                />
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
            ) : (
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <Medal className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <div className="font-bold text-gray-800">{userProfile.xp.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Study Streaks
          </h3>
          {isEditing ? (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Current Streak (max 7 days):</label>
              <input
                type="number"
                name="streak"
                value={editedProfile.streak}
                onChange={handleChange}
                className="w-24 border border-gray-300 rounded px-2 py-1"
                min="0"
                max="7"
              />
            </div>
          ) : null}
          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i}
                className={`h-8 w-full rounded-sm ${
                  i < userProfile.streak ? 'bg-green-400' : 'bg-gray-200'
                }`}
                title={`Day ${i+1}`}
              ></div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Current streak: {userProfile.streak} days
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;