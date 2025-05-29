'use client';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';
import { Laptop2, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function setLocale(locale: string) {
  if (localStorage) {
    localStorage.setItem('locale', locale);
    document.cookie = `locale=${locale}; path=/`;
    window.location.reload();
  }
}

export function getLocale() {
  return localStorage?.getItem('locale') || 'ro';
}

export const LanguageToggle = () => {
  const locale = getLocale();
  const t = useTranslations('Chat');

  return (
    <Tabs defaultValue={locale} className="w-full">
      <TabsList className="flex flex-1">
        <TabsTrigger
          value={t('romanian')}
          onClick={() => setLocale('ro')}
          className="flex-1"
          title="Engleză"
        >
          Română
        </TabsTrigger>
        <TabsTrigger
          value={t('english')}
          onClick={() => setLocale('en')}
          className="flex-1"
          title="Română"
        >
          English
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
