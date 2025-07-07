import { useState, useEffect, useCallback } from 'react';

export type ServerStatus = 'checking' | 'online' | 'offline' | 'starting';

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkServerStatus = useCallback(async (): Promise<boolean> => {
    try {
      setStatus('checking');
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setStatus('online');
        setLastChecked(new Date());
        return true;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      setStatus('offline');
      setLastChecked(new Date());
      return false;
    }
  }, []);

  const startServer = useCallback(async (): Promise<boolean> => {
    setStatus('starting');
    
    // Wait for potential auto-start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if server is now online
    return await checkServerStatus();
  }, [checkServerStatus]);

  // Auto-check on mount and periodically
  useEffect(() => {
    checkServerStatus();
    
    // Check every 30 seconds if offline
    const interval = setInterval(() => {
      if (status === 'offline') {
        checkServerStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkServerStatus, status]);

  return {
    status,
    lastChecked,
    checkServerStatus,
    startServer,
    isOnline: status === 'online',
    isOffline: status === 'offline',
    isChecking: status === 'checking',
    isStarting: status === 'starting'
  };
};