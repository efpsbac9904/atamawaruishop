import React, { useState } from 'react';
import { Character } from '../types/characters';
import { characterData } from '../data/characters';
import { useMultiRival } from '../context/MultiRivalContext';
import { Users, Plus, Minus, Shuffle } from 'lucide-react';

const MultiRivalSelector: React.FC = () => {
  const { 
    selectedRivals, 
    setSelectedRivals, 
    maxRivals, 
    setMaxRivals 
  } = useMultiRival();
  
  const [availableCharacters] = useState<Character[]>(characterData);

  const handleCharacterToggle = (character: Character) => {
    const isSelected = selectedRivals.some(rival => rival.id === character.id);
    
    if (isSelected) {
      setSelectedRivals(selectedRivals.filter(rival => rival.id !== character.id));
    } else if (selectedRivals.length < maxRivals) {
      setSelectedRivals([...selectedRivals, character]);
    }
  };

  const handleRandomSelection = () => {
    const shuffled = [...availableCharacters].sort(() => Math.random() - 0.8);
    const randomRivals = shuffled.slice(0, maxRivals);
    setSelectedRivals(randomRivals);
  };

  const handleMaxRivalsChange = (newMax: number) => {
    setMaxRivals(newMax);
    if (selectedRivals.length > newMax) {
      setSelectedRivals(selectedRivals.slice(0, newMax));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Select Your Rivals</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Max rivals:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleMaxRivalsChange(Math.max(1, maxRivals - 1))}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={maxRivals <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{maxRivals}</span>
            <button
              onClick={() => handleMaxRivalsChange(Math.min(5, maxRivals + 1))}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={maxRivals >= 5}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Selected: {selectedRivals.length} / {maxRivals}
        </p>
        <button
          onClick={handleRandomSelection}
          className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        >
          <Shuffle className="h-4 w-4 mr-1" />
          Random
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCharacters.map((character) => {
          const isSelected = selectedRivals.some(rival => rival.id === character.id);
          const canSelect = selectedRivals.length < maxRivals || isSelected;
          
          return (
            <div
              key={character.id}
              className={`relative rounded-lg overflow-hidden shadow-sm transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-offset-2 scale-105' 
                  : canSelect 
                    ? 'hover:shadow-md hover:scale-[1.02]' 
                    : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                ringColor: isSelected ? character.color : 'transparent'
              }}
              onClick={() => canSelect && handleCharacterToggle(character)}
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={character.avatar} 
                  alt={character.name} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-2 left-3 text-white font-bold text-sm">
                  {character.name}
                </h3>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span 
                    className="inline-block px-2 py-1 text-xs font-semibold rounded-full" 
                    style={{ backgroundColor: `${character.color}20`, color: character.color }}
                  >
                    {character.specialty}
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" title={`Speed: ${character.stats.speed}`}></div>
                    <div className="w-2 h-2 rounded-full bg-green-400" title={`Accuracy: ${character.stats.accuracy}`}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400" title={`Consistency: ${character.stats.consistency}`}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRivals.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Selected Rivals:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRivals.map((rival) => (
              <div 
                key={rival.id}
                className="flex items-center px-3 py-1 bg-white rounded-full shadow-sm border"
              >
                <img 
                  src={rival.avatar} 
                  alt={rival.name}
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                />
                <span className="text-sm font-medium">{rival.name}</span>
                <button
                  onClick={() => handleCharacterToggle(rival)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiRivalSelector;