import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Character } from '../types/characters';
import { characterData } from '../data/characters';
import CharacterCard from '../components/CharacterCard';
import CharacterDetail from '../components/CharacterDetail';
import UserProfile from '../components/UserProfile';
import { ArrowRight, Users } from 'lucide-react';

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

  const handleMultiRivalChallenge = () => {
    navigate('/multi-rival');
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Challenge</h2>
            
            {/* Challenge Mode Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">1 vs 1 Challenge</h3>
                <p className="text-sm text-blue-600 mb-4">
                  Compete against a single AI rival in a focused duel
                </p>
                <button
                  onClick={handleStartCompetition}
                  disabled={!selectedCharacter}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedCharacter 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Start 1v1
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">Multi-Rival Challenge</h3>
                <p className="text-sm text-purple-600 mb-4">
                  Compete against multiple AI rivals simultaneously
                </p>
                <button
                  onClick={handleMultiRivalChallenge}
                  className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Multi Challenge
                </button>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-4">Select a Rival for 1v1</h3>
            <p className="text-gray-600 mb-6">
              Choose a character to compete against. Each has their own learning style and strengths.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {characterData.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selected={selectedCharacter?.id === character.id}
                  onClick={() => handleCharacterClick(character)}
                />
              ))}
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