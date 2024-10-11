'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN } from './constant';

import type { AuthState } from '../../types';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      let accessToken = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
      let refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, refreshToken);
        const res = await axios.get(endpoints.auth.me);
        const user = res.data;
        setState({ user: { ...user, accessToken }, loading: false });
      } else if (refreshToken && isValidToken(refreshToken)) {
        try {
          const res = await axios.post(endpoints.auth.refreshToken, {
            refresh: refreshToken,
          });
          accessToken = res.data.access;
          // Check if a new refresh token was returned
          const newRefreshToken = res.data.refresh;
          if (newRefreshToken) {
            refreshToken = newRefreshToken;
          }

          if (accessToken) {
            await setSession(accessToken, refreshToken);
            const userRes = await axios.get(endpoints.auth.me);
            const user = userRes.data;
            setState({ user: { ...user, accessToken }, loading: false });
          } else {
            setState({ user: null, loading: false });
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
          setState({ user: null, loading: false });
        }
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
