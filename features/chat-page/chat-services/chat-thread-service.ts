'use server';
import 'server-only';

import { getCurrentUser, userHashedId, userSession } from '@/features/auth-page/helpers';
import { RedirectToChatThread } from '@/features/common/navigation-helpers';
import { ServerActionResponse } from '@/features/common/server-action-response';
import { uniqueId } from '@/features/common/util';
// import { NEW_CHAT_NAME } from '@/features/theme/theme-config';
import { HistoryContainer } from '../../common/services/cosmos';
import { ChatThreadModel } from './models';
import { RedirectToPage } from '../../common/navigation-helpers';

export const FindAllChatThreadForCurrentUser = async (
  token: string | undefined,
): Promise<ServerActionResponse<Array<ChatThreadModel>> | undefined> => {
  let response: any;
  try {
    const session: any = await userSession();
    response = await fetch(process.env.BASE_API_URL + '/api/thread', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.accessToken || token}`,
        'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
        'x-gpt-app': process.env.APP_ID || ''
      },
    });
    console.log("response", response); 
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
    if ([401, 403].includes(response?.status)) {
      RedirectToPage('logout');
    }
  }
};

export const FindChatThreadForCurrentUser = async (
  id: string,
  token?: string | undefined,
): Promise<ServerActionResponse<ChatThreadModel>> => {
  try {
    const session: any = await userSession();

    const response = await fetch(process.env.BASE_API_URL + `/api/thread/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken || token}`,
        'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
        'x-gpt-app': process.env.APP_ID || ''
      },
    });

    if (response.status !== 200) {
      return {
        status: 'ERROR',
        errors: [{ message: `${response.statusText || 'Server error'}` }],
      };
    }
    const resources = await response.json();

    return {
      status: 'OK',
      response: resources,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  }
};

export const EnsureChatThreadOperation = async (
  chatThreadID: string,
): Promise<ServerActionResponse<ChatThreadModel>> => {
  const response = await FindChatThreadForCurrentUser(chatThreadID);
  const currentUser = await getCurrentUser();
  const hashedId = await userHashedId();

  if (response.status === 'OK') {
    if (currentUser.isAdmin || response.response.userId === hashedId) {
      return response;
    }
  }

  return response;
};

export const AddExtensionToChatThread = async (props: {
  chatThreadId: string;
  extensionId: string;
}): Promise<ServerActionResponse<ChatThreadModel>> => {
  try {
    const response = await FindChatThreadForCurrentUser(props.chatThreadId);
    if (response.status === 'OK') {
      const chatThread = response.response;

      const existingExtension = chatThread.extension.find((e) => e === props.extensionId);

      if (existingExtension === undefined) {
        chatThread.extension.push(props.extensionId);
        return await UpsertChatThread(chatThread);
      }

      return {
        status: 'OK',
        response: chatThread,
      };
    }

    return response;
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  }
};

export const RemoveExtensionFromChatThread = async (props: {
  chatThreadId: string;
  extensionId: string;
}): Promise<ServerActionResponse<ChatThreadModel>> => {
  const response = await FindChatThreadForCurrentUser(props.chatThreadId);
  if (response.status === 'OK') {
    const chatThread = response.response;
    chatThread.extension = chatThread.extension.filter((e) => e !== props.extensionId);

    return await UpsertChatThread(chatThread);
  }

  return response;
};

export const UpsertChatThread = async (
  chatThread: ChatThreadModel,
): Promise<ServerActionResponse<ChatThreadModel>> => {
  try {
    if (chatThread.id) {
      const response = await EnsureChatThreadOperation(chatThread.id);
      if (response.status !== 'OK') {
        return response;
      }
    }

    chatThread.lastMessageAt = new Date();
    const { resource } = await HistoryContainer().items.upsert<ChatThreadModel>(chatThread);

    if (resource) {
      return {
        status: 'OK',
        response: resource,
      };
    }

    return {
      status: 'ERROR',
      errors: [{ message: `Chat thread not found` }],
    };
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  }
};

export const CreateChatThread = async (
  chatName?: string,
  token?: string | null,
  userId?: string | null,
): Promise<ServerActionResponse<ChatThreadModel>> => {
  try {
    const session: any = await userSession();
    const modelToSave: any = {
      name: chatName,
      userId: session?.userId || userId,
      id: uniqueId(),
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    };

    const response = await fetch(process.env.BASE_API_URL + '/api/thread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || session?.accessToken}`,
        'Ocp-Apim-Subscription-Key': process.env.API_SUBSCRIPTION_KEY || '',
        'x-gpt-app': process.env.APP_ID || ''
      },
      body: JSON.stringify(modelToSave),
    });

    if (response.status !== 200) {
      return {
        status: 'ERROR',
        errors: [{ message: `${response.statusText || 'Server error'}` }],
      };
    }
    const resource = await response.json();
    if (resource) {
      return {
        status: 'OK',
        response: resource,
      };
    }

    return {
      status: 'ERROR',
      errors: [{ message: `Chat thread not found` }],
    };
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateChatTitle = async (
  chatThreadId: string,
  title: string,
): Promise<ServerActionResponse<ChatThreadModel>> => {
  try {
    const response = await FindChatThreadForCurrentUser(chatThreadId);
    if (response.status === 'OK') {
      const chatThread = response.response;
      // take the first 30 characters
      chatThread.name = title.substring(0, 30);
      return await UpsertChatThread(chatThread);
    }
    return response;
  } catch (error) {
    return {
      status: 'ERROR',
      errors: [{ message: `${error}` }],
    };
  }
};

export const CreateChatAndRedirect = async (
  _: any,
  threadName?: string,
  token?: string | null,
  userId?: string | null,
) => {
  const response = await CreateChatThread(threadName, token, userId);

  if (response.status === 'OK') {
    RedirectToChatThread(response.response.id);
  }
};
