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
const SetupPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { selectedCharacter, problemCount, setProblemCount, timePerProblem, setTimePerProblem, setIsCompetitionActive, resetCompetition } = (0, AppContext_1.useAppContext)();
    const [isCustomTime, setIsCustomTime] = (0, react_1.useState)(false);
    const [customTime, setCustomTime] = (0, react_1.useState)(timePerProblem.toString());
    if (!selectedCharacter) {
        navigate('/');
        return null;
    }
    const handleStartCompetition = () => {
        resetCompetition();
        setIsCompetitionActive(true);
        navigate('/competition');
    };
    const handleProblemCountChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0 && value <= 50) {
            setProblemCount(value);
        }
    };
    const handleTimePresetClick = (seconds) => {
        setTimePerProblem(seconds);
        setIsCustomTime(false);
    };
    const handleCustomTimeClick = () => {
        setIsCustomTime(true);
        setCustomTime(timePerProblem.toString());
    };
    const handleCustomTimeChange = (e) => {
        const value = e.target.value;
        setCustomTime(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            setTimePerProblem(numValue);
        }
    };
    return (<div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
        <lucide_react_1.ArrowLeft className="w-4 h-4 mr-1"/>
        Back to character selection
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200" style={{
            backgroundColor: `${selectedCharacter.color}10`
        }}>
          <div className="flex items-center">
            <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-16 h-16 rounded-full object-cover border-2 mr-4" style={{ borderColor: selectedCharacter.color }}/>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Competition Setup</h1>
              <p className="text-gray-600">
                You'll be competing against {selectedCharacter.name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center mb-4">
              <lucide_react_1.ListChecks className="w-5 h-5 mr-2 text-gray-700"/>
              <h2 className="text-lg font-medium text-gray-900">Number of Problems</h2>
            </div>
            <div className="flex items-center space-x-4">
              <input type="range" min="1" max="50" step="1" value={problemCount} onChange={handleProblemCountChange} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
              <input type="number" min="1" max="50" value={problemCount} onChange={handleProblemCountChange} className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center"/>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>1</span>
              <span>problems</span>
              <span>50</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select how many problems you want to solve in this competition.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <lucide_react_1.Clock className="w-5 h-5 mr-2 text-gray-700"/>
              <h2 className="text-lg font-medium text-gray-900">Time per Problem</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[30, 60, 90, 120].map((seconds) => (<button key={seconds} onClick={() => handleTimePresetClick(seconds)} className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${timePerProblem === seconds && !isCustomTime
                ? 'bg-blue-100 text-blue-700 border-blue-300 border'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'}`}>
                  {seconds} sec
                </button>))}
            </div>
            
            <button onClick={handleCustomTimeClick} className={`flex items-center mb-4 text-sm ${isCustomTime ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              {isCustomTime ? (<div className="flex items-center w-full">
                  <span className="mr-2">Custom:</span>
                  <input type="number" min="5" value={customTime} onChange={handleCustomTimeChange} className="w-20 px-2 py-1 border border-blue-300 rounded-md text-sm" autoFocus/>
                  <span className="ml-2">seconds</span>
                </div>) : (<span>Use custom time</span>)}
            </button>
            
            <p className="text-sm text-gray-500">
              This is how much time you'll have for each problem. {selectedCharacter.name}'s 
              speed will be adjusted based on the time you choose.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Competition Summary</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• You'll solve {problemCount} problems</li>
              <li>• {timePerProblem} seconds per problem</li>
              <li>• Total time: {Math.floor((problemCount * timePerProblem) / 60)} min {(problemCount * timePerProblem) % 60} sec</li>
              <li>• Competing against: {selectedCharacter.name}</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <button onClick={handleStartCompetition} className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors">
              Start Competition
              <lucide_react_1.Play className="ml-2 w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = SetupPage;
