'use client';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY_REFRESH_TOKEN } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

export type SignUpParams = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  re_password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { access, refresh } = res.data;

    if (!access || !refresh) {
      throw new Error('Tokens not found in response');
    }

    setSession(access, refresh);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async (
  { username, email, password, first_name, last_name, re_password }: SignUpParams,
  setSuccessMsg: (message: string) => void,
  setErrorMsg: (message: string) => void
): Promise<void> => {
  const params = {
    username,
    email,
    password,
    first_name,
    last_name,
    re_password,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);
    const { email: responseEmail } = res.data;

    setSuccessMsg(`A verification email has been sent to: ${responseEmail}`);
  } catch (error) {
    console.error('Error during sign up:', error);

    const errorData = error;

    // Collect error messages
    const messages: string[] = [];

    if (typeof errorData === 'object') {
      Object.entries(errorData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          messages.push(...value);
        } else if (typeof value === 'string') {
          messages.push(value);
        }
      });
      const errorMessage = messages.join(' ');
      setErrorMsg(errorMessage);
    } else if (error instanceof Error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg(String(error));
    }

    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    // Logout accepts the refresh token to blacklist
    const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);

    await axios.post(endpoints.auth.logout, { refresh: refreshToken });
    await setSession(null, null);
    // router.replace('/');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Activate account
 *************************************** */
export const activateAccount = async (
  uid: string,
  token: string,
  setSuccessMsg: (message: string) => void,
  setErrorMsg: (message: string) => void
): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.activate, { uid, token });

    if (res.status === 204) {
      setSuccessMsg('Account activated successfully!');
    } else {
      setErrorMsg('Account activation failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during account activation:', error);
    setErrorMsg('An error occurred during account activation. Please try again later.');
    throw error;
  }
};
