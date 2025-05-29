import React, { ForwardRefRenderFunction } from 'react';

interface ChatMessageContentAreaProps {
  children?: React.ReactNode;
}

const ChatMessageContentArea: ForwardRefRenderFunction<
  HTMLDivElement,
  ChatMessageContentAreaProps
> = (props, ref) => {
  return (
    <div
      ref={ref}
      className="container relative flex min-h-screen max-w-3xl flex-col gap-16 pb-[240px] pt-16"
    >
      {props.children}
    </div>
  );
};

export default React.forwardRef(ChatMessageContentArea);
