import React from 'react';
import { Character } from '../types/characters';
import { Brain, Lightbulb, Zap, X, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div 
            className="h-48 w-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${character.avatar})`,
              backgroundPosition: 'center 30%'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/30"></div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-1 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <p className="text-sm text-gray-200">{character.specialty}</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
            <p className="text-gray-600">{character.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Learning Style</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-600">{character.learningStyle}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-3 text-yellow-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Speed</span>
                    <span className="text-sm font-medium" style={{ color: character.color }}>{character.stats.speed}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${character.stats.speed * 10}%`,
                        backgroundColor: character.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Accuracy</span>
                    <span className="text-sm font-medium" style={{ color: character.color }}>{character.stats.accuracy}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${character.stats.accuracy * 10}%`,
                        backgroundColor: character.color 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Consistency</span>
                    <span className="text-sm font-medium" style={{ color: character.color }}>{character.stats.consistency}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${character.stats.consistency * 10}%`,
                        backgroundColor: character.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Competition Style</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Strengths</p>
                  <p className="text-gray-600 text-sm">
                    {character.name.split(' ')[0]} excels at {character.stats.speed > 8 ? 'rapid problem-solving' : 
                      character.stats.accuracy > 8 ? 'precise answers' : 'maintaining steady progress'}.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Brain className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Study Habits</p>
                  <p className="text-gray-600 text-sm">
                    Prefers {character.stats.speed > character.stats.accuracy ? 'quick iterations over deep focus' : 
                      'thorough understanding over speed'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;