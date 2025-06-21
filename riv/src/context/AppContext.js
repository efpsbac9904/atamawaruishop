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
exports.AppProvider = exports.useAppContext = void 0;
const react_1 = __importStar(require("react"));
const AppContext = (0, react_1.createContext)(undefined);
const useAppContext = () => {
    const context = (0, react_1.useContext)(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
exports.useAppContext = useAppContext;
const STORAGE_KEY = 'learningRival_userProfile';
const getInitialProfile = () => {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (storedProfile) {
        return JSON.parse(storedProfile);
    }
    return {
        name: 'Learning Enthusiast',
        level: 1,
        competitions: 12,
        victories: 8,
        accuracy: 85,
        streak: 5
    };
};
const AppProvider = ({ children }) => {
    const [selectedCharacter, setSelectedCharacter] = (0, react_1.useState)(null);
    const [problemCount, setProblemCount] = (0, react_1.useState)(10);
    const [timePerProblem, setTimePerProblem] = (0, react_1.useState)(60);
    const [currentProblem, setCurrentProblem] = (0, react_1.useState)(0);
    const [userProgress, setUserProgress] = (0, react_1.useState)(0);
    const [rivalProgress, setRivalProgress] = (0, react_1.useState)(0);
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0);
    const [isCompetitionActive, setIsCompetitionActive] = (0, react_1.useState)(false);
    const [userScore, setUserScore] = (0, react_1.useState)(0);
    const [rivalScore, setRivalScore] = (0, react_1.useState)(0);
    const [rivalClearTime, setRivalClearTime] = (0, react_1.useState)(0);
    const [userProfile, setUserProfile] = (0, react_1.useState)(getInitialProfile);
    (0, react_1.useEffect)(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    }, [userProfile]);
    const resetCompetition = () => {
        setCurrentProblem(0);
        setUserProgress(0);
        setRivalProgress(0);
        setElapsedTime(0);
        setIsCompetitionActive(false);
        setUserScore(0);
        setRivalScore(0);
        setRivalClearTime(0);
    };
    return (<AppContext.Provider value={{
            selectedCharacter,
            setSelectedCharacter,
            problemCount,
            setProblemCount,
            timePerProblem,
            setTimePerProblem,
            currentProblem,
            setCurrentProblem,
            userProgress,
            setUserProgress,
            rivalProgress,
            setRivalProgress,
            elapsedTime,
            setElapsedTime,
            isCompetitionActive,
            setIsCompetitionActive,
            userScore,
            setUserScore,
            rivalScore,
            setRivalScore,
            rivalClearTime,
            setRivalClearTime,
            userProfile,
            setUserProfile,
            resetCompetition,
        }}>
      {children}
    </AppContext.Provider>);
};
exports.AppProvider = AppProvider;
