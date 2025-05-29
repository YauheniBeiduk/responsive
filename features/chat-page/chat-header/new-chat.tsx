'use client';

import { Button } from '@/features/ui/button';
import { LoadingIndicator } from '@/features/ui/loading';
import { Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
export const NewChat = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Chat');
  return (
    <Button
      aria-disabled={pending}
      size={'default'}
      type="submit"
      className="flex gap-2 border-0 bg-stone-50"
      variant={'outline'}
    >
      {pending ? <LoadingIndicator isLoading={pending} /> : <Plus size={18} />}
      {t('newChat')}
    </Button>
  );
};
