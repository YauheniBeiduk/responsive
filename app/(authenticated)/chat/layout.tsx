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
import { MenuTrayToggle } from '@/features/main-menu/menu-tray-toggle';
import { menuStore, useMenuState } from '@/features/main-menu/menu-store';
import { NewChat } from '@/features/chat-page/chat-menu/new-chat';
import { useIsMobile } from '@/features/hooks/useIsMobile';
import { usePathname } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [chatHistoryResponse, setChatHistoryResponse] = useState<any>(null);
  const [error, setError] = useState<any>([]);
  const { isMenuOpen } = useMenuState();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile && isMenuOpen) {
      menuStore.toggleMenu();
    }
  }, [pathname]);
  console.log('Fetch started');
  // useEffect(() => {
  //   async function fetchData() {
  //     let token;
  //     try {
  //       // If microsoftTeams.app.initialize throw error that mean app ran in browser.
  //       // we need to check that to use token from Tean SDK or server side token
  //       await microsoftTeams.app.initialize();
  //       const context = await microsoftTeams.app.getContext();
  //       token = await microsoftTeams.authentication.getAuthToken();
  //     } catch (e) {}
  //
  //     const chatHistoryResponse = await FindAllChatThreadForCurrentUser(token);
  //     setChatHistoryResponse(chatHistoryResponse);
  //
  //     if (chatHistoryResponse?.status !== 'OK') {
  //       setError(chatHistoryResponse?.errors);
  //     }
  //   }
  //
  //   fetchData();
  // }, [children]);

  if (error?.length) {
    return <DisplayError errors={error} />;
  }

  // if (!chatHistoryResponse) {
  //   return <PageLoader></PageLoader>; // Show a loading state while data is being fetched
  // }
  const menuItems = [
    {
      id: 'thread-1',
      name: 'Project Kickoff',
      createdAt: new Date('2025-05-01T10:00:00Z'),
      updatedAt: new Date('2025-05-01T10:30:00Z'),
      participants: ['Alice', 'Bob'],
      lastMessage: {
        sender: 'Alice',
        content: 'Let’s start the project!',
        timestamp: new Date('2025-05-01T10:29:00Z'),
      },
    },
    {
      id: 'thread-2',
      name: 'Design Review',
      createdAt: new Date('2025-05-02T14:00:00Z'),
      updatedAt: new Date('2025-05-02T14:45:00Z'),
      participants: ['Charlie', 'Dana'],
      lastMessage: {
        sender: 'Dana',
        content: 'Looks good to me!',
        timestamp: new Date('2025-05-02T14:44:00Z'),
      },
    },
  ];
  return (
    <div className="relative flex w-full flex-1">
      <div className="flex w-full flex-1">
        {children}

        {isMobile && (
          <div className="absolute right-0 z-10 flex h-12 items-center justify-end gap-2 px-4 py-2">
            <MenuTrayToggle />
            <NewChat />
          </div>
        )}

        {isMobile ? (
          isMenuOpen && (
            <div className="animate-slide-in-right fixed right-0 top-0 z-40 h-full w-[280px] border-l bg-stone-50 shadow-lg">
              <div className="flex justify-between">
                <MenuTrayToggle />
                <ChatMenuHeader />
              </div>
              <ScrollArea>
                <ChatMenu
                  menuItems={
                    chatHistoryResponse?.response ? chatHistoryResponse?.response : menuItems
                  }
                />
              </ScrollArea>
            </div>
          )
        ) : (
          <div>
            <ChatMenuHeader />
            <ScrollArea>
              <ChatMenu
                menuItems={
                  chatHistoryResponse?.response ? chatHistoryResponse?.response : menuItems
                }
              />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
