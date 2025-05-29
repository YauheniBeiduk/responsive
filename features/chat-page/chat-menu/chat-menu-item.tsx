'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/ui/dropdown-menu';
import { LoadingIndicator } from '@/features/ui/loading';
import { cn } from '@/ui/lib';
import { BookmarkCheck, MoreVertical, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState } from 'react';
import { ChatThreadModel } from '../chat-services/models';
import { BookmarkChatThread, UpdateChatThreadTitle } from './chat-menu-service';

interface ChatMenuItemProps {
  href: string;
  chatThread: ChatThreadModel;
  children?: React.ReactNode;
}

export const ChatMenuItem: FC<ChatMenuItemProps> = (props) => {
  const path = usePathname();
  const { isLoading } = useDropdownAction({
    chatThread: props.chatThread,
  });

  return (
    <div className="group flex rounded-sm pr-3 text-muted-foreground hover:bg-muted hover:text-muted-foreground">
      <Link
        href={props.href}
        className={cn(
          'flex flex-1 items-center gap-2 overflow-hidden p-3',
          path.startsWith(props.href) && props.href !== '/' ? 'text-primary' : '',
        )}
      >
        {props.children}
      </Link>
    </div>
  );
};

type DropdownAction = 'bookmark' | 'rename' | 'delete';

const useDropdownAction = (props: { chatThread: ChatThreadModel }) => {
  const { chatThread } = props;
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
  };
};

export const DropdownMenuItemWithIcon: FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = (props) => {
  return (
    <DropdownMenuItem className="flex gap-2" onClick={props.onClick}>
      {props.children}
    </DropdownMenuItem>
  );
};
