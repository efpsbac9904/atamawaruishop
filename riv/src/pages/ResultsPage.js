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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AppContext_1 = require("../context/AppContext");
const lucide_react_1 = require("lucide-react");
const ResultsPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { selectedCharacter, problemCount, setProblemCount, timePerProblem, setTimePerProblem, elapsedTime, userProgress, rivalProgress, userScore, rivalScore, rivalClearTime, resetCompetition, userProfile, setUserProfile, } = (0, AppContext_1.useAppContext)();
    const [showRematchSettings, setShowRematchSettings] = (0, react_1.useState)(false);
    const [newProblemCount, setNewProblemCount] = (0, react_1.useState)(problemCount);
    const [newTimePerProblem, setNewTimePerProblem] = (0, react_1.useState)(timePerProblem);
    (0, react_1.useEffect)(() => {
        if (!selectedCharacter || (userScore === 0 && rivalScore === 0)) {
            navigate('/');
        }
    }, [selectedCharacter, userScore, rivalScore, navigate]);
    (0, react_1.useEffect)(() => {
        if (userScore > 0 || rivalScore > 0) {
            const userWon = userScore >= rivalScore;
            const accuracy = Math.round((userScore / 100) * 100);
            setUserProfile(prev => (Object.assign(Object.assign({}, prev), { competitions: prev.competitions + 1, victories: userWon ? prev.victories + 1 : prev.victories, accuracy: Math.round((prev.accuracy + accuracy) / 2), streak: userWon ? prev.streak + 1 : 0 })));
        }
    }, [userScore, rivalScore, setUserProfile]);
    if (!selectedCharacter)
        return null;
    const userWon = userScore >= rivalScore;
    const totalTime = Math.floor(elapsedTime / 60) + ':' + (elapsedTime % 60).toString().padStart(2, '0');
    const rivalTime = Math.floor(rivalClearTime / 60) + ':' + (rivalClearTime % 60).toString().padStart(2, '0');
    const problemsSolved = Math.round((userProgress / 100) * problemCount);
    const userCompleted = userProgress >= 100;
    const rivalCompleted = rivalProgress >= 100;
    const handleRematch = () => {
        if (showRematchSettings) {
            setProblemCount(newProblemCount);
            setTimePerProblem(newTimePerProblem);
        }
        resetCompetition();
        navigate('/competition');
    };
    const handleBackToHome = () => {
        resetCompetition();
        navigate('/');
    };
    return (<div className="max-w-4xl mx-auto">
      <button onClick={handleBackToHome} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
        <lucide_react_1.ArrowLeft className="w-4 h-4 mr-1"/>
        Back to home
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`p-8 text-center ${userWon ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-gray-700 to-gray-900'}`}>
          <h1 className="text-3xl font-bold text-white mb-4">
            {userWon ? 'Congratulations!' : 'Nice Try!'}
          </h1>
          <div className="flex justify-center mb-6">
            {userWon ? (<lucide_react_1.Trophy className="h-16 w-16 text-yellow-300"/>) : (<lucide_react_1.Medal className="h-16 w-16 text-gray-300"/>)}
          </div>
          <p className="text-xl text-white">
            {userWon
            ? 'You won the competition against ' + selectedCharacter.name + '!'
            : selectedCharacter.name + ' won this time. Keep practicing!'}
          </p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Competition Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className={`rounded-lg p-6 ${userWon ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-blue-700">You</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Your Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <lucide_react_1.Trophy className="w-5 h-5 text-blue-500 mr-3"/>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold text-gray-800">{userScore}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <lucide_react_1.Clock className="w-5 h-5 text-blue-500 mr-3"/>
                  <div>
                    <p className="text-sm text-gray-600">Clear Time</p>
                    <p className="text-lg font-medium text-gray-800">{totalTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <lucide_react_1.BarChart3 className="w-5 h-5 text-blue-500 mr-3"/>
                  <div>
                    <p className="text-sm text-gray-600">Problems Completed</p>
                    <p className="text-lg font-medium text-gray-800">
                      {problemsSolved} of {problemCount} 
                      {userCompleted ? ' (Complete)' : ' (Incomplete)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-6 ${!userWon ? `bg-${selectedCharacter.color.replace('#', '')}-50 border border-${selectedCharacter.color.replace('#', '')}-100` : 'bg-gray-50 border border-gray-200'}`} style={{
            backgroundColor: !userWon ? `${selectedCharacter.color}10` : '',
            borderColor: !userWon ? `${selectedCharacter.color}30` : ''
        }}>
              <div className="flex items-center mb-4">
                <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                <h3 className="text-lg font-medium text-gray-800">{selectedCharacter.name}'s Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <lucide_react_1.Trophy className="w-5 h-5 mr-3" style={{ color: selectedCharacter.color }}/>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold text-gray-800">{rivalScore}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <lucide_react_1.Clock className="w-5 h-5 mr-3" style={{ color: selectedCharacter.color }}/>
                  <div>
                    <p className="text-sm text-gray-600">Clear Time</p>
                    <p className="text-lg font-medium text-gray-800">{rivalTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <lucide_react_1.BarChart3 className="w-5 h-5 mr-3" style={{ color: selectedCharacter.color }}/>
                  <div>
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-lg font-medium text-gray-800">
                      {selectedCharacter.stats.accuracy * 10}% accuracy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Performance Analysis</h3>
            <p className="text-gray-600 mb-4">
              {userWon
            ? `Congratulations on beating ${selectedCharacter.name}! ${userScore - rivalScore > 20
                ? 'You won by a significant margin.'
                : 'It was a close competition!'}`
            : `${selectedCharacter.name} won this time. ${rivalScore - userScore > 20
                ? 'There\'s room for improvement.'
                : 'You were very close to winning!'}`}
            </p>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Areas to Focus On:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  {userCompleted
            ? 'Great job completing all problems!'
            : 'Try to complete all problems within the time limit.'}
                </li>
                <li>
                  {elapsedTime < (problemCount * timePerProblem * 0.8)
            ? 'Your speed was excellent.'
            : 'Work on increasing your solving speed.'}
                </li>
                <li>Continue practicing to improve consistency and accuracy.</li>
              </ul>
            </div>
          </div>

          {showRematchSettings && (<div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Rematch Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Number of Problems
                  </label>
                  <input type="number" min="1" max="50" value={newProblemCount} onChange={(e) => setNewProblemCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} className="w-full px-3 py-2 border border-blue-200 rounded-md"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Time per Problem (seconds)
                  </label>
                  <input type="number" min="10" max="300" value={newTimePerProblem} onChange={(e) => setNewTimePerProblem(Math.min(300, Math.max(10, parseInt(e.target.value) || 10)))} className="w-full px-3 py-2 border border-blue-200 rounded-md"/>
                </div>
              </div>
            </div>)}
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={handleRematch} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center">
              <lucide_react_1.RefreshCw className="w-5 h-5 mr-2"/>
              {showRematchSettings ? 'Start Rematch' : 'Quick Rematch'}
            </button>
            
            <button onClick={() => setShowRematchSettings(!showRematchSettings)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center">
              <lucide_react_1.Settings className="w-5 h-5 mr-2"/>
              {showRematchSettings ? 'Hide Settings' : 'Adjust Settings'}
            </button>
            
            <button onClick={handleBackToHome} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center">
              <lucide_react_1.ArrowLeft className="w-5 h-5 mr-2"/>
              Choose Another Rival
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = ResultsPage;
