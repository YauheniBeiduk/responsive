'use client';
import { RedirectToPage } from '@/features/common/navigation-helpers';
import { showError } from '@/features/globals/global-message-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/features/ui/dropdown-menu';
import { LoadingIndicator } from '@/features/ui/loading';
import { MoreVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenuItemWithIcon } from './chat-menu-item';

export const ChatContextMenu = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading}>
        {isLoading ? (
          <LoadingIndicator isLoading={isLoading} />
        ) : (
          <MoreVertical size={18} aria-label="Chat Menu Dropdown Menu" />
        )}
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};
