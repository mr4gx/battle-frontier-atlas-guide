
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Battle } from '@/types';

interface BattleLockContextType {
  isLocked: boolean;
  activeBattleRoute: string | null;
  currentBattle: Battle | null;
  lockNavigation: (route: string, battle?: Battle) => void;
  unlockNavigation: () => void;
}

const BattleLockContext = createContext<BattleLockContextType | undefined>(undefined);

export function BattleLockProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [activeBattleRoute, setActiveBattleRoute] = useState<string | null>(null);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If we detect we're on a battle results page, automatically lock navigation
  useEffect(() => {
    if (location.pathname === '/battle/results' && !isLocked) {
      lockNavigation('/battle/results');
    }
  }, [location.pathname, isLocked]);

  const lockNavigation = (route: string, battle?: Battle) => {
    setIsLocked(true);
    setActiveBattleRoute(route);
    if (battle) {
      setCurrentBattle(battle);
    }
  };

  const unlockNavigation = () => {
    setIsLocked(false);
    setActiveBattleRoute(null);
    setCurrentBattle(null);
    
    // If we're still on the battle results page when unlocking, redirect to dashboard
    if (location.pathname === '/battle/results' && !redirectInProgress) {
      setRedirectInProgress(true);
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        navigate('/dashboard');
        setRedirectInProgress(false);
      }, 0);
    }
  };

  // If navigation is locked and we try to navigate away, prevent it
  useEffect(() => {
    if (isLocked && activeBattleRoute && location.pathname !== activeBattleRoute && !redirectInProgress) {
      navigate(activeBattleRoute);
    }
  }, [location.pathname, isLocked, activeBattleRoute, navigate, redirectInProgress]);

  return (
    <BattleLockContext.Provider value={{ 
      isLocked, 
      activeBattleRoute, 
      currentBattle,
      lockNavigation, 
      unlockNavigation 
    }}>
      {children}
    </BattleLockContext.Provider>
  );
}

export function useBattleLock() {
  const context = useContext(BattleLockContext);
  if (context === undefined) {
    return {
      isLocked: false,
      activeBattleRoute: null,
      currentBattle: null,
      lockNavigation: () => {},
      unlockNavigation: () => {}
    };
  }
  return context;
}
