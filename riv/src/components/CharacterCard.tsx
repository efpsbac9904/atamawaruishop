import React from 'react';
import { Character } from '../types/characters';
import { Brain, Lightbulb, Zap } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  selected, 
  onClick 
}) => {
  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
        selected 
          ? `ring-4 ring-offset-2 scale-105 ring-${character.color.replace('#', '')}` 
          : 'hover:shadow-lg hover:scale-[1.02]'
      }`}
      onClick={onClick}
      style={{ 
        borderColor: selected ? character.color : 'transparent',
        cursor: 'pointer' 
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={character.avatar} 
          alt={character.name} 
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
        ></div>
        <h3 className="absolute bottom-3 left-4 text-white font-bold text-xl">
          {character.name}
        </h3>
        {selected && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center mb-2">
          <span 
            className="inline-block px-2 py-1 text-xs font-semibold rounded-full mr-2" 
            style={{ backgroundColor: `${character.color}20`, color: character.color }}
          >
            {character.specialty}
          </span>
          <span className="text-xs text-gray-500">
            {character.learningStyle}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${character.stats.speed * 10}%`,
                  backgroundColor: character.color
                }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-gray-600">Speed</span>
          </div>
          
          <div className="flex items-center">
            <Brain className="w-4 h-4 mr-2 text-purple-500" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full"
                style={{ 
                  width: `${character.stats.accuracy * 10}%`,
                  backgroundColor: character.color
                }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-gray-600">Accuracy</span>
          </div>
          
          <div className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-blue-500" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full"
                style={{ 
                  width: `${character.stats.consistency * 10}%`,
                  backgroundColor: character.color
                }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-gray-600">Consistency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;