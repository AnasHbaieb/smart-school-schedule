import { createContext, useContext, ReactNode } from 'react';
import { useAppData, AppData } from '@/hooks/useAppData';

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const data = useAppData();
  return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>;
}

export function useData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useData must be used within AppDataProvider');
  return ctx;
}
