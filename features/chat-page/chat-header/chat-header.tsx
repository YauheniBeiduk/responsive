'use client';
import { FC } from 'react';
import { ChatThreadModel } from '../chat-services/models';
import { CreateChatAndRedirect } from '../chat-services/chat-thread-service';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as microsoftTeams from '@microsoft/teams-js';
import { useIsMobile } from '@/features/hooks/useIsMobile';

interface Props {
  chatThread: ChatThreadModel;
}

export const ChatHeader: FC<Props> = (props) => {
  const t = useTranslations('Chat');
  const [isTeams, setIsTeams] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    async function fetchData() {
      let token;
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();
        setIsTeams(true);

        setUserId(context.user?.id || null);
        token = await microsoftTeams.authentication.getAuthToken();
        setToken(token);
      } catch (e) {}
    }

    fetchData();
  }, []);
  const name = t('newChat');
  return (
    <div className="items-left flex bg-background px-2 pb-2 pt-8 lg:py-2">
      <div className="container flex items-center justify-start">
        {!isTeams && (
          <div className="flex flex-col items-center justify-center">
            <Image src={'/logo.png'} width={isMobile ? 60 : 100} height={60} alt="logo"></Image>
          </div>
        )}
        <div className="flex items-center justify-start px-10 text-3xl sm:text-lg">
          <p>{props.chatThread.name || t('newChat')}</p>
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          CreateChatAndRedirect(null, name, token, userId);
        }}
        className="flex gap-2 pr-3"
      >
      </form>

    </div>
  );
};
