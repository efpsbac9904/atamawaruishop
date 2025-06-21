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
  const { selectedCharacter, setSelectedCharacter } = useAppContext();
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);

  const handleCharacterClick = (character: Character) => {
    if (selectedCharacter?.id === character.id) {
      setViewingCharacter(character);
    } else {
      setSelectedCharacter(character);
    }
  };

  const handleStartCompetition = () => {
    if (selectedCharacter) {
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
          Choose your rival character and compete in learning challenges to improve your knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfile />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Rival</h2>
            <p className="text-gray-600 mb-6">
              Select a character to compete against. Each has their own learning style and strengths.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {characterData.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selected={selectedCharacter?.id === character.id}
                  onClick={() => handleCharacterClick(character)}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartCompetition}
                disabled={!selectedCharacter}
                className={`flex items-center px-6 py-3 rounded-lg shadow-md font-medium text-white transition-all duration-200 ${
                  selectedCharacter 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Start Competition
                <ArrowRight className="ml-2 h-5 w-5" />
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