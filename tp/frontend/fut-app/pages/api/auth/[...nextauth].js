import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      return {
        session,
        token,
        user,
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET_KEY,
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24,
    updateAge: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
