'use server';
import 'server-only';

import { ServerActionResponse } from '@/features/common/server-action-response';
import { uniqueId } from '@/features/common/util';
import { SqlQuerySpec } from '@azure/cosmos';
import { HistoryContainer } from '../../common/services/cosmos';
import { ChatMessageModel, ChatRole, MESSAGE_ATTRIBUTE } from './models';
import { userHashedId, userSession } from '@/features/auth-page/helpers';
import { RedirectToPage } from '../../common/navigation-helpers';

export const FindTopChatMessagesForCurrentUser = async (
  chatThreadID: string,
  top: number = 30,
): Promise<ServerActionResponse<Array<ChatMessageModel>>> => {
  try {
    const querySpec: SqlQuerySpec = {
      query:
        'SELECT TOP @top * FROM root r WHERE r.type=@type AND r.threadId = @threadId AND r.userId=@userId AND r.isDeleted=@isDeleted ORDER BY r.createdAt DESC',
      parameters: [
        {
          name: '@type',
          value: MESSAGE_ATTRIBUTE,
        },
        {
          name: '@threadId',
          value: chatThreadID,
        },
        {
          name: '@userId',
          value: await userHashedId(),
        },
        {
          name: '@isDeleted',
          value: false,
        },
        {
          name: '@top',
          value: top,
        },
      ],
    };

    const { resources } = await HistoryContainer()
      .items.query<ChatMessageModel>(querySpec)
      .fetchAll();

    return {
      status: 'OK',
      response: resources,
    };
  } catch (e) {
    return {
      status: 'ERROR',
      errors: [
        {
          message: `${e}`,
        },
      ],
    };
  }
};

export const FindAllChatMessagesForCurrentUser = async (
  chatThreadID: string,
  token: string | undefined,
): Promise<ServerActionResponse<Array<ChatMessageModel>>> => {
  try {
    const session = await userSession();

    const response = await fetch(
      `${process.env.BASE_API_URL}/api/thread/${chatThreadID}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.accessToken || token}`,
          'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
          'x-gpt-app': process.env.APP_ID || ''
        },
      },
    );

    const resources = await response.json();

    return {
      status: 'OK',
      response: resources,
    };
  } catch (e) {
    return {
      status: 'ERROR',
      errors: [
        {
          message: `${e}`,
        },
      ],
    };
  }
};

export const CreateChatMessage = async (
  body: any,
  token?: string | null,
  userId?: string | null,
): Promise<ServerActionResponse<ChatMessageModel> | undefined> => {
  const session = await userSession();
  let response: any;
  try {
    const data = { ...body, userId: session?.userId || userId };
    response = await fetch(process.env.BASE_API_URL + '/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || session?.accessToken || ''}`,
        'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
        'x-gpt-app': process.env.APP_ID || ''
      },
    });
    if (![200, 401, 403].includes(response.status)) {
      return {
        status: 'ERROR',
        errors: [{ message: `${response.statusText || 'Server error'}` }],
      };
    } else if (response.status === 200) {
      const resource = await response.json();
      return {
        status: 'OK',
        response: resource,
      };
    }
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  } finally {
    // next redirect should not be in try catch block
    if ([401, 403].includes(response?.status)) {
      RedirectToPage('logout');
      return {
        status: 'ERROR',
        errors: [{ message: `Session expired` }],
      };
    }
  }
};

export const SetLikeToChatMessage = async (
  messageId: string,
  reaction: string,
  token: string | null,
): Promise<ServerActionResponse<ChatMessageModel>> => {
  const session = await userSession();
  try {
    const response = await fetch(process.env.BASE_API_URL + `/api/chat/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({
        reaction,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || session?.accessToken || ''}`,
        'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
        'x-gpt-app': process.env.APP_ID || ''
      },
    });
    const resources = await response.json();
    return {
      status: 'OK',
      response: resources,
    };
  } catch (e) {
    return {
      status: 'ERROR',
      errors: [
        {
          message: `${e}`,
        },
      ],
    };
  }
};

export const UpsertChatMessage = async (
  chatModel: ChatMessageModel,
): Promise<ServerActionResponse<ChatMessageModel>> => {
  try {
    const modelToSave: ChatMessageModel = {
      ...chatModel,
      id: uniqueId(),
      createdAt: new Date(),
      type: MESSAGE_ATTRIBUTE,
      isDeleted: false,
    };

    const { resource } = await HistoryContainer().items.upsert<ChatMessageModel>(modelToSave);

    if (resource) {
      return {
        status: 'OK',
        response: resource,
      };
    }

    return {
      status: 'ERROR',
      errors: [
        {
          message: `Chat message not found`,
        },
      ],
    };
  } catch (e) {
    return {
      status: 'ERROR',
      errors: [
        {
          message: `${e}`,
        },
      ],
    };
  }
};
