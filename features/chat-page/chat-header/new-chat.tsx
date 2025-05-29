'use client';

import { Button } from '@/features/ui/button';
import { LoadingIndicator } from '@/features/ui/loading';
import { Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/features/hooks/useIsMobile';

export const NewChat = () => {
  const { pending } = useFormStatus();
  const isMobile = useIsMobile();

  const t = useTranslations('Chat');
  return (
    <Button
      aria-disabled={pending}
      size={'default'}
      type="submit"
      className="flex gap-2 border-0 lg:bg-stone-50"
      variant={'outline'}
    >
      {pending ? <LoadingIndicator isLoading={pending} /> : <Plus size={18} />}
      {isMobile ? null : t('newChat')}
    </Button>
  );
};
