import { DefaultSession } from 'next-auth';

// https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin: boolean;
      id: string;
    } & DefaultSession['user'];
  }

  interface Token {
    isAdmin: boolean;
  }

  interface User {
    isAdmin: boolean;
    oid: string;
  }
}
