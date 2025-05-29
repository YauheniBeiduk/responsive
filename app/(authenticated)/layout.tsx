'use client';
import { AuthenticatedProviders } from '@/features/globals/providers';
import { MainMenu } from '@/features/main-menu/main-menu';
import { cn } from '@/ui/lib';
import * as microsoftTeams from '@microsoft/teams-js';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isTeams, setIsTeams] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        await microsoftTeams.app.getContext();
        setIsTeams(true);
      } catch (e) {}
    }

    fetchData();
  }, []);

  return (
    <AuthenticatedProviders>
      <div className={cn('flex flex-1 items-stretch')}>
        {!isTeams && <MainMenu />}
        <div className="flex flex-1">{children}</div>
      </div>
    </AuthenticatedProviders>
  );
}
