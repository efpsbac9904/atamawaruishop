import React from 'react';
import { User, Medal, Trophy, Award } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-4 shadow-md">
            <User className="h-10 w-10 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Profile</h2>
            <p className="text-blue-100">Learning Enthusiast</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Your Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-500">Competitions</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-gray-800">8</div>
              <div className="text-xs text-gray-500">Victories</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <Medal className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="font-bold text-gray-800">85%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Study Streaks
          </h3>
          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i}
                className={`h-8 w-full rounded-sm ${
                  i < 5 ? 'bg-green-400' : 'bg-gray-200'
                }`}
                title={`Day ${i+1}`}
              ></div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Current streak: 5 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;