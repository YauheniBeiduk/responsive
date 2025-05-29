import { AI_NAME } from '@/features/theme/theme-config';
import { ThemeProvider } from '@/features/theme/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from '@/features/ui/toaster';
import { cn } from '@/ui/lib';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className="h-full w-full overflow-hidden text-sm">
      <body className={cn(inter.className, 'flex h-full w-full bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
