export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/nutritionist/dashboard/:path*',
    '/patient/dashboard/:path*',
  ],
};
