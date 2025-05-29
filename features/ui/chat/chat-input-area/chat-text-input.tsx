import React from 'react';
import { useTranslations } from 'next-intl';

export const ChatTextInput = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> // Add ChatInputAreaProps to the type definition
>(({ ...props }, ref) => {
  const t = useTranslations('Chat');
  return (
    <textarea
      ref={ref}
      className="w-full resize-none bg-transparent p-4 focus:outline-none"
      placeholder={t('inputHolder')}
      {...props}
    />
  );
});
ChatTextInput.displayName = 'ChatTextInput';
