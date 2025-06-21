"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const react_router_dom_1 = require("react-router-dom");
const Layout_1 = __importDefault(require("./components/Layout"));
const HomePage_1 = __importDefault(require("./pages/HomePage"));
const SetupPage_1 = __importDefault(require("./pages/SetupPage"));
const CompetitionPage_1 = __importDefault(require("./pages/CompetitionPage"));
const ResultsPage_1 = __importDefault(require("./pages/ResultsPage"));
exports.router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: '/',
        element: <Layout_1.default />,
        children: [
            {
                index: true,
                element: <HomePage_1.default />,
            },
            {
                path: 'setup',
                element: <SetupPage_1.default />,
            },
            {
                path: 'competition',
                element: <CompetitionPage_1.default />,
            },
            {
                path: 'results',
                element: <ResultsPage_1.default />,
            },
        ],
    },
]);
