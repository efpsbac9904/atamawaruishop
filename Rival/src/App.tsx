import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MultiRivalProvider } from './context/MultiRivalContext';
import { MultiplayerProvider } from './context/MultiplayerContext';
import { router } from './router';

function App() {
  return (
    <AppProvider>
      <MultiRivalProvider>
        <MultiplayerProvider>
          <RouterProvider router={router} />
        </MultiplayerProvider>
      </MultiRivalProvider>
    </AppProvider>
  );
}

export default App;