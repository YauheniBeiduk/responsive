'use server';
import 'server-only';

import { getCurrentUser } from '@/features/auth-page/helpers';
import { CHAT_DEFAULT_SYSTEM_PROMPT } from '@/features/theme/theme-config';
import { ChatApiRAG } from '../chat-api/chat-api-rag';

import { CreateChatMessage, FindTopChatMessagesForCurrentUser } from '../chat-message-service';
import { EnsureChatThreadOperation } from '../chat-thread-service';
import { ChatThreadModel, UserPrompt } from '../models';
import { mapOpenAIChatMessages } from '../utils';

import { OpenAIStream } from './open-ai-stream';
type ChatTypes = 'extensions' | 'chat-with-file' | 'multimodal';

export const ChatAPIEntry = async (props: UserPrompt, signal: AbortSignal) => {
  const currentChatThreadResponse = await EnsureChatThreadOperation(props.id);

  if (currentChatThreadResponse.status !== 'OK') {
    return new Response('', { status: 401 });
  }

  const currentChatThread = currentChatThreadResponse.response;

  // promise all to get user, history and docs
  const [user, history] = await Promise.all([getCurrentUser(), _getHistory(currentChatThread)]);
  // Starting values for system and user prompt
  // Note that the system message will also get prepended with the extension execution steps. Please see ChatApiExtensions method.
  currentChatThread.personaMessage = `${CHAT_DEFAULT_SYSTEM_PROMPT} \n\n ${currentChatThread.personaMessage}`;

  let chatType: ChatTypes = 'extensions';

  // save the user message

  let runner = await ChatApiRAG({
    chatThread: currentChatThread,
    userMessage: props.message,
    history: history,
    signal: signal,
  });

  const readableStream = OpenAIStream({
    runner: runner,
    chatThread: currentChatThread,
  });

  return new Response(readableStream, {
    headers: {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};

const _getHistory = async (chatThread: ChatThreadModel) => {
  const historyResponse = await FindTopChatMessagesForCurrentUser(chatThread.id);

  if (historyResponse.status === 'OK') {
    const historyResults = historyResponse.response;
    return mapOpenAIChatMessages(historyResults).reverse();
  }

  console.error('🔴 Error on getting history:', historyResponse.errors);

  return [];
};
