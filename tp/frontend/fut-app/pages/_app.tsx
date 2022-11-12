import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} {...router}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
