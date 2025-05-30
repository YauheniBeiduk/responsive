'use client';

import { Button } from '@/features/ui/button';
import { LoadingIndicator } from '@/features/ui/loading';
import { Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/features/hooks/useIsMobile';
import { useEffect, useState } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { CreateChatAndRedirect } from '@/features/chat-page/chat-services/chat-thread-service';

export const NewChat = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Chat');
  const name = t('newChat');

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
        setUserId(context.user?.id || null);
        token = await microsoftTeams.authentication.getAuthToken();
        setToken(token);
      } catch (e) {}
    }

    fetchData();
  }, []);

  return (
    <Button
      aria-disabled={pending}
      size={'default'}
      type="submit"
      className="flex gap-2 border-0 bg-stone-50"
      variant={'outline'}
      onClick={async (e) => {
        e.preventDefault();
        CreateChatAndRedirect(null, name, token, userId);
      }}
    >
      {pending ? <LoadingIndicator isLoading={pending} /> : <Plus size={18} />}
      {isMobile ? null : t('newChat')}
    </Button>
  );
};
