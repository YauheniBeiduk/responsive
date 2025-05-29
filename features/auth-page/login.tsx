'use client';
import { AI_NAME } from '@/features/theme/theme-config';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { FC } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/features/ui/page-loader';
interface LoginProps {
  isDevMode: boolean;
}

export const LogIn: FC<LoginProps> = (props) => {
  const t = useTranslations('Chat');
  const [isTeamsChecked, setIsTeamsChecked] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const token = await microsoftTeams.authentication.getAuthToken();
        if (token) {
          router.push('/chat');
        } else {
          setIsTeamsChecked(true);
        }
      } catch (e) {
        setIsTeamsChecked(true);
      }
    }

    fetchData();
  }, []);

  if (!isTeamsChecked) {
    return <PageLoader></PageLoader>;
  }

  return (
    <Card className="flex min-w-[300px] flex-col gap-2">
      <CardHeader className="gap-2">
        <CardTitle className="flex flex-col items-center gap-2 text-2xl">
          <Image src={'/mega_logo.png'} width={200} height={100} alt="logo"></Image>
        </CardTitle>
        <CardDescription>{t('logInWelcome')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant={'outline'} onClick={() => signIn('azure-ad')}>
          {' '}
          Microsoft 365
        </Button>
        {props.isDevMode ? (
          <Button variant={'outline'} onClick={() => signIn('localdev')}>
            Basic Auth (DEV ONLY)
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
