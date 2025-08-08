import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SetupPage from './pages/SetupPage';
import CompetitionPage from './pages/CompetitionPage';
import ResultsPage from './pages/ResultsPage';
import MultiRivalPage from './pages/MultiRivalPage';
import MultiCompetitionPage from './pages/MultiCompetitionPage';
import MultiResultsPage from './pages/MultiResultsPage';
import RankingPage from './pages/RankingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'setup',
        element: <SetupPage />,
      },
      {
        path: 'competition',
        element: <CompetitionPage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'multi-rival',
        element: <MultiRivalPage />,
      },
      {
        path: 'multi-competition',
        element: <MultiCompetitionPage />,
      },
      {
        path: 'multi-results',
        element: <MultiResultsPage />,
      },
      {
        path: 'ranking',
        element: <RankingPage />,
      },
    ],
  },
]);