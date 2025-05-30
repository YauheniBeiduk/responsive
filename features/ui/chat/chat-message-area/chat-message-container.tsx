import React, { ForwardRefRenderFunction } from 'react';
import { ScrollArea } from '../../scroll-area';

interface ChatMessageContainerProps {
  children?: React.ReactNode;
}

const ChatMessageContainer: ForwardRefRenderFunction<HTMLDivElement, ChatMessageContainerProps> = (
  props,
  ref,
) => {
  return (
    <ScrollArea ref={ref} className="h-full flex-1 px-2" type="always">
      {props.children}
    </ScrollArea>
  );
};

export default React.forwardRef(ChatMessageContainer);
