'use client';

import React from 'react';
import { LoadingIndicator } from '../../loading';

interface ChatInputAreaProps {
  status?: string;
}

export const ChatInputForm = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement> & ChatInputAreaProps // Add ChatInputAreaProps to the type definition
>(({ status, ...props }, ref) => (
  <div className="sticky bottom-0 z-10 w-full bg-white p-2">
    <div className="container flex max-w-3xl flex-col gap-1">
      <ChatInputStatus status={status} />
      <div className="overflow-hidden rounded-md border bg-stone-50 backdrop-blur-xl focus-within:border-primary">
        <form ref={ref} className="flex items-center p-[2px]" {...props}>
          {props.children}
        </form>
      </div>
    </div>
  </div>
));
ChatInputForm.displayName = 'ChatInputArea';

export const ChatInputStatus = (props: { status?: string }) => {
  if (props.status === undefined || props.status === '') return null;
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2 rounded-full border bg-background p-2 px-5 text-sm">
        <LoadingIndicator isLoading={true} /> {props.status}
      </div>
    </div>
  );
};

export const ChatInputActionArea = (props: { children?: React.ReactNode }) => {
  return <div className="flex justify-between p-2">{props.children}</div>;
};

export const ChatInputPrimaryActionArea = (props: { children?: React.ReactNode }) => {
  return <div className="flex">{props.children}</div>;
};

export const ChatInputSecondaryActionArea = (props: { children?: React.ReactNode }) => {
  return <div className="flex">{props.children}</div>;
};
