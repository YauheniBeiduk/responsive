import SendIcon from '@mui/icons-material/Send';
import React from 'react';
import { Button } from '../../button';

interface ChatInputAreaProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean; // This is actually already included in HTMLAttributes<HTMLButtonElement>
}

export const SubmitChat = React.forwardRef<
  HTMLButtonElement,
  ChatInputAreaProps // Add ChatInputAreaProps to the type definition
>(({ ...props }, ref) => (
  <Button
    size="icon"
    type="submit"
    variant={'ghost'}
    disabled={props.disabled}
    {...props}
    ref={ref}
    aria-label="Submit chat input"
  >
    <SendIcon sx={{ color: 'gray' }} />
  </Button>
));
SubmitChat.displayName = 'ChatInputArea';
