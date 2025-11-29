import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'nutritionist-login',
      name: 'Nutritionist Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const nutritionist = await prisma.nutritionist.findUnique({
          where: { email: credentials.email },
        });

        if (!nutritionist) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          nutritionist.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: nutritionist.id,
          email: nutritionist.email,
          name: nutritionist.name,
          userType: 'nutritionist',
        };
      },
    }),
    CredentialsProvider({
      id: 'patient-login',
      name: 'Patient Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const patient = await prisma.patient.findUnique({
          where: { email: credentials.email },
        });

        if (!patient) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          patient.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: patient.id,
          email: patient.email,
          name: patient.name,
          userType: 'patient',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).userType = token.userType;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
