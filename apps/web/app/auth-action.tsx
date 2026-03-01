'use client';

import { signIn, signOut } from 'next-auth/react';

interface AuthActionProps {
  mode: 'signin' | 'signout';
  callbackUrl: string;
  className: string;
  children: React.ReactNode;
}

export function AuthAction({ mode, callbackUrl, className, children }: AuthActionProps) {
  const handleClick = async () => {
    if (mode === 'signin') {
      await signIn('google', { callbackUrl });
      return;
    }

    await signOut({ callbackUrl });
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
