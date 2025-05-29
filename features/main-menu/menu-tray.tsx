'use client';

import { cn } from '@/ui/lib';
import React from 'react';
import { useMenuState } from './menu-store';

export const MenuTray = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isMenuOpen } = useMenuState();
    return (
      <div
        ref={ref}
        /*className={'hidden'} */
        className={cn(
          'flex w-96 flex-col overflow-hidden border-r transition-all duration-700',
          isMenuOpen ? 'translate-x-0' : '-ml-96 -translate-x-full',
          className,
        )}
        {...props}
      >
        {props.children}
      </div>
    );
  },
);
MenuTray.displayName = 'MenuTray';
