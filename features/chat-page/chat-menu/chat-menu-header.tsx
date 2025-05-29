'use client';
import { CreateChatAndRedirect } from '../chat-services/chat-thread-service';
import { NewChat } from './new-chat';
import { useTranslations } from 'next-intl';
import * as microsoftTeams from '@microsoft/teams-js';
import { useEffect, useState } from 'react';

export const ChatMenuHeader = () => {
  const t = useTranslations('Chat');
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      let token;
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();
        setUserId(context.user?.id || null);
        token = await microsoftTeams.authentication.getAuthToken();
        setToken(token);
      } catch (e) {}
    }

    fetchData();
  }, []);
  const name = t('newChat');
  return (
    <div className="flex items-center justify-between bg-stone-50 p-2 px-3">
      <p className="text-xl">{t('chatHistory')}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          CreateChatAndRedirect(null, name, token, userId);
        }}
        className="flex gap-2 pr-3"
      >
        <NewChat />
      </form>
    </div>
  );
};
