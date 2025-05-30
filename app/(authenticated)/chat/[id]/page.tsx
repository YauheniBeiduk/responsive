'use client';
import { ChatPage } from '@/features/chat-page/chat-page';
import { FindAllChatMessagesForCurrentUser } from '@/features/chat-page/chat-services/chat-message-service';
import { FindChatThreadForCurrentUser } from '@/features/chat-page/chat-services/chat-thread-service';
import { DisplayError } from '@/features/ui/error/display-error';
import { useState, useEffect } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { PageLoader } from '@/features/ui/page-loader';

interface HomeParams {
  params: {
    id: string;
  };
}

export default function Home(props: HomeParams) {
  const { id } = props.params;

  const [allChatMessagesForCurrentUser, setAllChatMessagesForCurrentUser] = useState<any>(null);
  const [chatThreadForCurrentUser, setChatThreadForCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>([]);

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

      const [chatResponse, chatThreadResponse] = await Promise.all([
        FindAllChatMessagesForCurrentUser(id, token),
        FindChatThreadForCurrentUser(id, token),
      ]);
      setAllChatMessagesForCurrentUser(chatResponse);

      if (chatResponse.status !== 'OK') {
        setError(chatResponse.errors);
      }

      setChatThreadForCurrentUser(chatThreadResponse);

      if (chatThreadResponse.status !== 'OK') {
        setError(chatThreadResponse.errors);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader></PageLoader>;
  }

  if (error.length) {
    return <DisplayError errors={error} />;
  }

  return (
    <ChatPage
      messages={allChatMessagesForCurrentUser?.response}
      chatThread={chatThreadForCurrentUser?.response}
    />
  );
}
