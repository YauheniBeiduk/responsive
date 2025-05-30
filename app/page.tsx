import { redirectIfAuthenticated } from '@/features/auth-page/helpers';
import { LogIn } from '@/features/auth-page/login';

export default async function Temp() {
  await redirectIfAuthenticated();
  return (
    <main className="container flex max-w-lg items-center justify-center">
      <LogIn isDevMode={process.env.NODE_ENV === 'development'} />
    </main>
  );
}
