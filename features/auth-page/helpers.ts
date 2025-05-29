import { createHash } from 'crypto';
import { getServerSession } from 'next-auth';
import { RedirectToPage } from '../common/navigation-helpers';
import { options } from './auth-api';
import { serverSession } from './server-helper';

export const userSession = async (display?: any): Promise<any | null> => {
  const session = (await getServerSession(options)) as any;
  const token = await serverSession().get('token');
  const all = await serverSession().all();
  if (session && session.user) {
    return {
      name: session.user.name!,
      image: session.user.image!,
      email: session.user.email!,
      isAdmin: session.user.isAdmin!,
      accessToken: session.accessToken,
      userId: session.user.id,
    };
  } else if (token) {
    const user = await serverSession().get('user');
    const email = await serverSession().get('email');
    return {
      name: email!,
      image: null,
      email: email!,
      isAdmin: false,
      accessToken: token,
      userId: user,
    };
  }

  return null;
};

export const getCurrentUser = async (): Promise<UserModel> => {
  const user = await userSession();
  if (user) {
    return user;
  }
  throw new Error('User not found');
};

export const userHashedId = async (): Promise<string> => {
  const user = await userSession();
  if (user) {
    return hashValue(user.email);
  }

  throw new Error('User not found');
};

export const hashValue = (value: string): string => {
  const hash = createHash('sha256');
  hash.update(value);
  return hash.digest('hex');
};

export const redirectIfAuthenticated = async () => {
  const user = await userSession();
  if (user) {
    RedirectToPage('chat');
  }
};

export type UserModel = {
  name: string;
  image: string;
  email: string;
  isAdmin: boolean;
};
