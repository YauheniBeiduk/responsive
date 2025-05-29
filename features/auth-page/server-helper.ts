'use server';
import 'server-only';
import nextAppSession from 'next-app-session';

type MySessionData = {
  token?: string;
  user?: string;
  email: string;
};

export const serverSession = nextAppSession<MySessionData>({
  name: 'SIDCUST',
  secret: process.env.NEXTAUTH_SECRET,
  cookie: {
    sameSite: 'none',
    secure: true,
  },
});

export const setSession = async (data: any) => {
  await serverSession().set('token', data.token);
  await serverSession().set('user', data.user);
  await serverSession().set('email', data.email);

  const all = await serverSession().all();
};
