'use client';
import { uniqueId } from '@/features/common/util';
import { showError } from '@/features/globals/global-message-store';

import { FormEvent } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { RevalidateCache } from '../common/navigation-helpers';
import { InputImageStore } from '../ui/chat/chat-input-area/input-image-store';
import { textToSpeechStore } from './chat-input/speech/use-text-to-speech';
import { ResetInputRows } from './chat-input/use-chat-input-dynamic-height';
import {
  AddExtensionToChatThread,
  RemoveExtensionFromChatThread,
  UpdateChatTitle,
} from './chat-services/chat-thread-service';
import { AzureChatCompletion, ChatMessageModel, ChatThreadModel } from './chat-services/models';
import { CreateChatMessage } from '@/features/chat-page/chat-services/chat-message-service';
let abortController: AbortController = new AbortController();

type chatStatus = 'idle' | 'loading' | 'file upload';

class ChatState {
  public messages: Array<ChatMessageModel> = [];
  public loading: chatStatus = 'idle';
  public input: string = '';
  public lastMessage: string = '';
  public autoScroll: boolean = false;
  public userName: string = '';
  public chatThreadId: string = '';

  private chatThread: ChatThreadModel | undefined;

  private addToMessages(message: ChatMessageModel) {
    const currentMessage = this.messages.find((el) => el.id === message.id);
    if (currentMessage) {
      currentMessage.content = message.content;
    } else {
      this.messages.push(message);
    }
  }

  private removeMessage(id: string) {
    const index = this.messages.findIndex((el) => el.id === id);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }

  public updateLoading(value: chatStatus) {
    this.loading = value;
  }

  public initChatSession({
    userName,
    messages,
    chatThread,
    token,
    userId,
  }: {
    chatThread: ChatThreadModel;
    userName: string;
    messages: Array<ChatMessageModel>;
    token: string;
    userId: string | null;
  }) {
    this.chatThread = chatThread;
    this.chatThreadId = chatThread.id;
    this.messages = messages;
    this.userName = userName;

    if (this.input) {
      const formData = new FormData();

      const body = JSON.stringify({
        id: this.chatThreadId,
        message: this.input,
      });
      formData.append('content', body);

      this.chat(formData, token, userId);
    }
  }

  public async AddExtensionToChatThread(extensionId: string) {
    this.loading = 'loading';

    const response = await AddExtensionToChatThread({
      extensionId: extensionId,
      chatThreadId: this.chatThreadId,
    });
    RevalidateCache({
      page: 'chat',
      type: 'layout',
    });

    if (response.status !== 'OK') {
      showError(response.errors[0].message);
    }

    this.loading = 'idle';
  }

  public async RemoveExtensionFromChatThread(extensionId: string) {
    this.loading = 'loading';

    const response = await RemoveExtensionFromChatThread({
      extensionId: extensionId,
      chatThreadId: this.chatThreadId,
    });

    RevalidateCache({
      page: 'chat',
    });

    if (response.status !== 'OK') {
      showError(response.errors[0].message);
    }

    this.loading = 'idle';
  }

  public updateInput(value: string) {
    this.input = value;
  }

  public stopGeneratingMessages() {
    abortController.abort();
  }

  public updateAutoScroll(value: boolean) {
    this.autoScroll = value;
  }

  private reset() {
    this.input = '';
    ResetInputRows();
    InputImageStore.Reset();
  }

  private async chat(formData: any, token: string | null, userId: string | null) {

    this.loading = 'loading';

    const newUserMessage: ChatMessageModel = {
      id: uniqueId(),
      role: 'user',
      content: this.input,

      createdAt: new Date(),
      threadId: this.chatThreadId,
      userId: '',
    };

    this.messages.push(newUserMessage);
    this.reset();

    const controller = new AbortController();
    abortController = controller;

    try {
      if (this.chatThreadId === '' || this.chatThreadId === undefined) {
        showError('Chat thread ID is empty');
        return;
      }

      const response = await CreateChatMessage(newUserMessage, token, userId);

      this.loading = 'idle';
      if (response?.status === 'OK') {
        this.messages.push(response.response);
      }
    } catch (error) {
      showError('' + error);
      this.loading = 'idle';
    }
  }

  private async updateTitle() {}

  private completed(message: string) {
    textToSpeechStore.speak(message);
  }

  public async submitChat(
    e: FormEvent<HTMLFormElement>,
    token: string | null,
    userId: string | null,
  ) {
    e.preventDefault();
    if (this.input === '' || this.loading !== 'idle') {
      return;
    }

    const body = JSON.stringify({
      id: this.chatThreadId,
      message: this.input,
    });

    this.chat(body, token, userId);
    if (this.messages.length > 1) {
      this.updateAutoScroll(true);
    }
  }
}

export const chatStore = proxy(new ChatState());

export const useChat = () => {
  return useSnapshot(chatStore, { sync: true });
};
