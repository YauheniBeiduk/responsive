'use client';
import { ChatInput } from '@/features/chat-page/chat-input/chat-input';
import { chatStore, useChat } from '@/features/chat-page/chat-store';
import { ChatLoading } from '@/features/ui/chat/chat-message-area/chat-loading';
import { ChatMessageArea } from '@/features/ui/chat/chat-message-area/chat-message-area';
import ChatMessageContainer from '@/features/ui/chat/chat-message-area/chat-message-container';
import ChatMessageContentArea from '@/features/ui/chat/chat-message-area/chat-message-content';
import { useChatScrollAnchor } from '@/features/ui/chat/chat-message-area/use-chat-scroll-anchor';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useRef } from 'react';
import { ExtensionModel } from '../extensions-page/extension-services/models';
import { ChatHeader } from './chat-header/chat-header';
import { ChatDocumentModel, ChatMessageModel, ChatThreadModel } from './chat-services/models';
import MessageContent from './message-content';
import * as microsoftTeams from '@microsoft/teams-js';
interface ChatPageProps {
  messages: Array<ChatMessageModel>;
  chatThread: ChatThreadModel;
}

export const ChatPage: FC<ChatPageProps> = (props) => {
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();

        const token = await microsoftTeams.authentication.getAuthToken();
        return { id: context.user?.id, token, name: context.user?.displayName };
      } catch (e) {}
      return null;
    }

    fetchData().then((context: any) => {
      chatStore.initChatSession({
        chatThread: props.chatThread,
        messages: props.messages,
        userName: context?.name || session?.user?.name!,
        token: context?.token,
        userId: context?.id,
      });
    });
  }, []);

  const { messages, loading } = useChat();

  const current = useRef<HTMLDivElement>(null);

  useChatScrollAnchor({ ref: current });

  return (
    <main className="red relative flex flex-1 flex-col overflow-x-hidden p-2">
      <ChatHeader chatThread={props.chatThread} />
      <ChatMessageContainer ref={current}>
        <ChatMessageContentArea>
          {messages
            .filter((message: any) => message.role === 'assistant' || message.role === 'user')
            .map((message: any) => {
              return (
                <ChatMessageArea
                  key={message.id}
                  messageId={message.id}
                  profileName={message.name}
                  role={message.role}
                  reaction={message.reaction}
                  links={message.links}
                  onCopy={() => {
                    navigator.clipboard.writeText(message.content);
                  }}
                  profilePicture={
                    message.role === 'assistant' ? '/ai-icon.png' : session?.user?.image
                  }
                >
                  <MessageContent message={message} />
                </ChatMessageArea>
              );
            })}
          {loading === 'loading' && <ChatLoading />}
        </ChatMessageContentArea>
      </ChatMessageContainer>
      <ChatInput />
    </main>
  );
};
