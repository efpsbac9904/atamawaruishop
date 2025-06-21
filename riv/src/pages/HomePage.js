"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AppContext_1 = require("../context/AppContext");
const characters_1 = require("../data/characters");
const CharacterCard_1 = __importDefault(require("../components/CharacterCard"));
const CharacterDetail_1 = __importDefault(require("../components/CharacterDetail"));
const UserProfile_1 = __importDefault(require("../components/UserProfile"));
const lucide_react_1 = require("lucide-react");
const HomePage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { selectedCharacter, setSelectedCharacter } = (0, AppContext_1.useAppContext)();
    const [viewingCharacter, setViewingCharacter] = (0, react_1.useState)(null);
    const handleCharacterClick = (character) => {
        if ((selectedCharacter === null || selectedCharacter === void 0 ? void 0 : selectedCharacter.id) === character.id) {
            setViewingCharacter(character);
        }
        else {
            setSelectedCharacter(character);
        }
    };
    const handleStartCompetition = () => {
        if (selectedCharacter) {
            navigate('/setup');
        }
    };
    return (<div className="space-y-8">
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
          <UserProfile_1.default />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Rival</h2>
            <p className="text-gray-600 mb-6">
              Select a character to compete against. Each has their own learning style and strengths.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {characters_1.characterData.map((character) => (<CharacterCard_1.default key={character.id} character={character} selected={(selectedCharacter === null || selectedCharacter === void 0 ? void 0 : selectedCharacter.id) === character.id} onClick={() => handleCharacterClick(character)}/>))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button onClick={handleStartCompetition} disabled={!selectedCharacter} className={`flex items-center px-6 py-3 rounded-lg shadow-md font-medium text-white transition-all duration-200 ${selectedCharacter
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'}`}>
                Start Competition
                <lucide_react_1.ArrowRight className="ml-2 h-5 w-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewingCharacter && (<CharacterDetail_1.default character={viewingCharacter} onClose={() => setViewingCharacter(null)}/>)}
    </div>);
};
exports.default = HomePage;
