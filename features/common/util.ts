import { customAlphabet } from 'nanoid';

import { ChatThreadModel } from '../chat-page/chat-services/models';
import { v4 as uuidv4 } from 'uuid';

export const uniqueId = () => {
  return uuidv4();
};

export const sortByTimestamp = (a: ChatThreadModel, b: ChatThreadModel) => {
  return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
};
