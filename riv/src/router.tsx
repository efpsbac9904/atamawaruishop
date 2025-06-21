import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SetupPage from './pages/SetupPage';
import CompetitionPage from './pages/CompetitionPage';
import ResultsPage from './pages/ResultsPage';

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
    ],
  },
]);