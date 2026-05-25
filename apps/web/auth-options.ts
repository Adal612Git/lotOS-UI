import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from './lib/env';
import { isAuthorizedEmail, normalizeEmail } from './lib/owner';

const providers = env.googleConfigured
  ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      }),
    ]
  : [];

export const authOptions: NextAuthOptions = {
  secret: env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      const email = normalizeEmail(user.email);
      return isAuthorizedEmail(email);
    },
  },
};
