'use client';

import { ScrollArea } from '@/features/ui/scroll-area';
import Image from 'next/image';
import { ChatInput } from '../chat-page/chat-input/chat-input';
import { ChatMessageArea } from '@/features/ui/chat/chat-message-area/chat-message-area';
import MessageContent from '../chat-page/message-content';
import { useTranslations } from 'next-intl';

export const ChatHome = () => {
  const t = useTranslations('Chat');
  return (
    <ScrollArea className="flex-1">
      <div className="flex h-full h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-6 pt-40">
          <div className="flex flex-col items-center justify-center">
            <Image src={'/mega_logo.png'} width={200} height={100} alt="logo"></Image>
          </div>
          <ChatMessageArea
            key={'0'}
            messageId={'0'}
            profileName={'MegaGpt'}
            role={'system'}
            onCopy={() => {
              navigator.clipboard.writeText('Hello data');
            }}
            profilePicture={'/logo.png'}
          >
            <MessageContent message={{ content: t('helpQuestion'), role: 'user', name: 'Mega' }} />
          </ChatMessageArea>
        </main>
        <ChatInput />
      </div>
    </ScrollArea>
  );
};
