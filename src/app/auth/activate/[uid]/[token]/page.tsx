'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { activateAccount } from 'src/auth/context/jwt/action';
import { paths } from 'src/routes/paths';

const ActivateAccount = () => {
  const router = useRouter();
  const { uid, token } = useParams();
  const [activationStatus, setActivationStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  );

  useEffect(() => {
    // Type guard to ensure uid and token are strings
    if (typeof uid === 'string' && typeof token === 'string') {
      console.log('uid', uid);
      console.log('token', token);
      const activateUserAccount = async () => {
        try {
          await activateAccount(
            uid,
            token,
            () => setActivationStatus('success'),
            () => setActivationStatus('error')
          );
        } catch (error) {
          setActivationStatus('error');
        }
      };
      activateUserAccount();
    } else {
      setActivationStatus('error'); // Handle case where uid or token is not a string
    }
  }, [uid, token]);

  if (activationStatus === 'pending') {
    return <p>Activating your account...</p>;
  }

  if (activationStatus === 'success') {
    return (
      <div>
        <h1>Account Activated</h1>
        <p>Your account has been successfully activated.</p>
        <button type="button" onClick={() => router.push(paths.auth.jwt.signIn)}>
          Go to Login
        </button>
      </div>
    );
  }

  if (activationStatus === 'error') {
    return (
      <div>
        <h1>Activation Failed</h1>
        <p>There was an error activating your account. Please try again later.</p>
      </div>
    );
  }

  return null;
};

export default ActivateAccount;
