import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { setSession, isValidToken } from 'src/auth/context/jwt/utils';
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN } from 'src/auth/context/jwt/constant';

// ----------------------------------------------------------------------

const API_VERSION = 'v1';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== endpoints.auth.signIn
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);

      if (refreshToken && isValidToken(refreshToken)) {
        try {
          const res = await axiosInstance.post(endpoints.auth.refreshToken, {
            refresh: refreshToken,
          });

          const accessToken = res.data.access;
          const newRefreshToken = res.data.refresh;

          if (accessToken) {
            await setSession(accessToken, newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return await axiosInstance(originalRequest); // Added 'await' here
          }
        } catch (err) {
          // Renamed 'error' to 'err' to avoid shadowing
          console.error('Error refreshing token:', err);
          window.location.href = paths.auth.jwt.signIn;
        }
      } else {
        delete axios.defaults.headers.common.Authorization;
        window.location.href = paths.auth.jwt.signIn;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: `/api/${API_VERSION}/auth/users/me/`, // Get current user profile
    signIn: `/api/${API_VERSION}/auth/jwt/create/`, // JWT-based login
    signUp: `/api/${API_VERSION}/auth/users/`, // User registration
    logout: `/api/${API_VERSION}/auth/token/blacklist/`, // JWT token blacklist (logout)
    refreshToken: `/api/${API_VERSION}/auth/jwt/refresh/`, // JWT refresh token
    activate: `/api/${API_VERSION}/auth/users/activation/`, // User account activation
    resendActivation: `/api/${API_VERSION}/auth/users/resend_activation/`, // Resend activation email
    resetPassword: `/api/${API_VERSION}/auth/users/reset_password/`, // Password reset
    resetPasswordConfirm: `/api/${API_VERSION}/auth/users/reset_password_confirm/`, // Password reset confirmation
    setPassword: `/api/${API_VERSION}/auth/users/set_password/`, // Set a new password
  },
  storyline: {
    list: `/api/${API_VERSION}/storyline/`, // Get the list of storylines
    adventure: (adventureId: Number) => `/api/${API_VERSION}/adventure/${adventureId}/`,
    quest: (questId: Number) => `/api/${API_VERSION}/quest/${questId}/`,
  },
  personalization: {
    list: `/api/${API_VERSION}/personalizations/`, // Get the list of personalization options
    detail: (personalizationId: Number) =>
      `/api/${API_VERSION}/personalizations/${personalizationId}/`,
  },
};
