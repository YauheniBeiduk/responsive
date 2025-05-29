'use client';
import { ChatMenu } from '@/features/chat-page/chat-menu/chat-menu';
import { ChatMenuHeader } from '@/features/chat-page/chat-menu/chat-menu-header';
import { FindAllChatThreadForCurrentUser } from '@/features/chat-page/chat-services/chat-thread-service';
import { MenuTray } from '@/features/main-menu/menu-tray';
import { cn } from '@/ui/lib';

import * as microsoftTeams from '@microsoft/teams-js';
import { useEffect, useState } from 'react';

import { DisplayError } from '@/features/ui/error/display-error';
import { ScrollArea } from '@/features/ui/scroll-area';
import { PageLoader } from '@/features/ui/page-loader';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [chatHistoryResponse, setChatHistoryResponse] = useState<any>(null);
  const [error, setError] = useState<any>([]);

  console.log('Fetch started');
  useEffect(() => {
    async function fetchData() {
      let token;
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();
        token = await microsoftTeams.authentication.getAuthToken();
      } catch (e) {}

      const chatHistoryResponse = await FindAllChatThreadForCurrentUser(token);
      setChatHistoryResponse(chatHistoryResponse);

      if (chatHistoryResponse?.status !== 'OK') {
        setError(chatHistoryResponse?.errors);
      }
    }

    fetchData();
  }, [children]);

  if (error?.length) {
    return <DisplayError errors={error} />;
  }

  if (!chatHistoryResponse) {
    return <PageLoader></PageLoader>; // Show a loading state while data is being fetched
  }

  return (
    <div className={cn('flex flex-1 items-stretch')}>
      <div className="flex flex-1">
        {children}
        <MenuTray>
          <ChatMenuHeader />
          <ScrollArea>
            <ChatMenu menuItems={chatHistoryResponse.response} />
          </ScrollArea>
        </MenuTray>
      </div>
    </div>
  );
}
