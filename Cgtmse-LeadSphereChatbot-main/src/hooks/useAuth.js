import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
      setIsAuthenticated(Boolean(user && user.email));
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await authService.login(email, password);
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      const result = await authService.logout();
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  return {
    currentUser,
    isAuthenticated,
    authLoading,
    login,
    logout
  };
}
