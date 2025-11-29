import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: 'nutritionist' | 'patient';
    } & DefaultSession['user'];
  }

  interface User {
    userType: 'nutritionist' | 'patient';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userType: 'nutritionist' | 'patient';
  }
}
