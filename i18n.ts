import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
export default getRequestConfig(async () => {
  const locale = cookies().get('locale') || { value: 'ro' };
  return {
    locale: locale.value,
    messages: (await import(`./locales/${locale.value}.json`)).default,
  };
});
