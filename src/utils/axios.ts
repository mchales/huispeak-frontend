import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const API_VERSION = 'v1';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
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
};
