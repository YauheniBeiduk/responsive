import { sortByTimestamp } from '@/features/common/util';
import { FC } from 'react';
import { ChatThreadModel } from '../chat-services/models';
import { ChatMenuItem } from './chat-menu-item';

interface ChatMenuProps {
  menuItems: Array<ChatThreadModel>;
}

export const ChatMenu: FC<ChatMenuProps> = (props) => {
  return (
    <div className="flex h-screen flex-col gap-3 bg-stone-50 px-3 pt-10">
      {props.menuItems?.sort(sortByTimestamp).map((item) => (
        <ChatMenuItem key={item.id} href={`/chat/${item.id}`} chatThread={item}>
          {
            <div className="flex w-full justify-between">
              <span>{item.name.replace('\n', '')}</span>
              <span className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          }
        </ChatMenuItem>
      ))}
    </div>
  );
};
