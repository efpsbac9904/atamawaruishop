"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ProgressBar = ({ progress, color, label, animated = true }) => {
    return (<div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className={`h-4 rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`} style={{
            width: `${progress}%`,
            backgroundColor: color
        }}></div>
      </div>
    </div>);
};
exports.default = ProgressBar;
