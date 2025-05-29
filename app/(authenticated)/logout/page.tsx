'use client';

import React, { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    });
  }, []);

  return <div className="flex h-screen flex-col items-center justify-center"></div>;
}
