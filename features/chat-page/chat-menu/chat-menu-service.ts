'use server';

import { RedirectToPage, RevalidateCache } from '@/features/common/navigation-helpers';
import { ServerActionResponse } from '@/features/common/server-action-response';
import {
  FindAllChatThreadForCurrentUser,
  UpsertChatThread,
} from '../chat-services/chat-thread-service';
import { ChatThreadModel } from '../chat-services/models';

export const UpdateChatThreadTitle = async (props: {
  chatThread: ChatThreadModel;
  name: string;
}) => {
  await UpsertChatThread({
    ...props.chatThread,
    name: props.name,
  });

  RevalidateCache({
    page: 'chat',
    type: 'layout',
  });
};

export const BookmarkChatThread = async (props: { chatThread: ChatThreadModel }) => {
  await UpsertChatThread({
    ...props.chatThread,
    bookmarked: !props.chatThread.bookmarked,
  });

  RevalidateCache({
    page: 'chat',
    type: 'layout',
  });
};
