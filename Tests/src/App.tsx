import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MultiRivalProvider } from './context/MultiRivalContext';
import { router } from './router';

function App() {
  return (
    <AppProvider>
      <MultiRivalProvider>
        <RouterProvider router={router} />
      </MultiRivalProvider>
    </AppProvider>
  );
}

export default App;