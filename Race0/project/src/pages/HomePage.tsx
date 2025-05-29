import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Character } from '../types/characters';
import { characterData } from '../data/characters';
import CharacterCard from '../components/CharacterCard';
import CharacterDetail from '../components/CharacterDetail';
import UserProfile from '../components/UserProfile';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRivals, setSelectedRivals } = useAppContext();
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);

  const handleCharacterClick = (character: Character) => {
    const isSelected = selectedRivals.some(rival => rival.id === character.id);
    if (isSelected) {
      setViewingCharacter(character);
    } else {
      setSelectedRivals([...selectedRivals, character]);
    }
  };

  const handleRemoveRival = (character: Character) => {
    setSelectedRivals(selectedRivals.filter(rival => rival.id !== character.id));
  };

  const handleStartCompetition = () => {
    if (selectedRivals.length > 0) {
      navigate('/setup');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          <span className="block">Study Rival Challenge</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Choose one or more rivals and compete in learning challenges to improve your knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfile />
          
          {selectedRivals.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Rivals</h3>
              <div className="space-y-3">
                {selectedRivals.map(rival => (
                  <div key={rival.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={rival.avatar} 
                        alt={rival.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <span className="text-gray-700">{rival.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveRival(rival)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Rivals</h2>
            <p className="text-gray-600 mb-6">
              Select one or more characters to compete against. Each has their own learning style and strengths.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {characterData.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selected={selectedRivals.some(rival => rival.id === character.id)}
                  onClick={() => handleCharacterClick(character)}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartCompetition}
                disabled={selectedRivals.length === 0}
                className={`flex items-center px-6 py-3 rounded-lg shadow-md font-medium text-white transition-all duration-200 ${
                  selectedRivals.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Start Competition
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewingCharacter && (
        <CharacterDetail
          character={viewingCharacter}
          onClose={() => setViewingCharacter(null)}
        />
      )}
    </div>
  );
};

export default HomePage;