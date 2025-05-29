'use client';

import {
  ResetInputRows,
  onKeyDown,
  onKeyUp,
  useChatInputDynamicHeight,
} from '@/features/chat-page/chat-input/use-chat-input-dynamic-height';

import { ChatInputForm } from '@/features/ui/chat/chat-input-area/chat-input-area';
import { ChatTextInput } from '@/features/ui/chat/chat-input-area/chat-text-input';
import { StopChat } from '@/features/ui/chat/chat-input-area/stop-chat';
import { SubmitChat } from '@/features/ui/chat/chat-input-area/submit-chat';
import React, { useRef, useState, useEffect } from 'react';
import { chatStore, useChat } from '../chat-store';
import { CreateChatAndRedirect } from '@/features/chat-page/chat-services/chat-thread-service';
import * as microsoftTeams from '@microsoft/teams-js';

export const ChatInput = () => {
  const { loading, input, chatThreadId } = useChat();
  const [creatingChat, setCreatingChat] = useState(false);
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

  const { rows } = useChatInputDynamicHeight();

  const submitButton = React.useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <ChatInputForm
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        const inputValue = inputRef.current?.value || '';

        if (!chatThreadId) {
          setCreatingChat(true);
          if (!creatingChat) {
            await CreateChatAndRedirect(null, inputValue, token, userId);
          }

          setCreatingChat(false);
        } else {
          chatStore.submitChat(e, token, userId);
        }
      }}
    >
      <ChatTextInput
        ref={inputRef}
        onBlur={(e) => {
          if (e.currentTarget.value.replace(/\s/g, '').length === 0) {
            ResetInputRows();
          }
        }}
        onKeyDown={(e) => {
          onKeyDown(e, submit);
        }}
        onKeyUp={(e) => {
          onKeyUp(e);
        }}
        value={input}
        rows={rows}
        onChange={(e) => {
          chatStore.updateInput(e.currentTarget.value);
        }}
      />
      <div className="mr-1 h-5 border-2"></div>
      <SubmitChat disabled={loading === 'loading'} ref={submitButton} />
    </ChatInputForm>
  );
};
