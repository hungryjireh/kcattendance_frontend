import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [generatedEventDetails, setGeneratedEventDetails] = useState(null);
  const value = {
    session: [session, setSession],
    generatedEventDetails: [generatedEventDetails, setGeneratedEventDetails]
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}