import { AppProps } from 'next/app';
// import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    // <Provider session={pageProps.session} {...router}>
    <Component {...pageProps} />
    // </Provider>
  );
}

export default MyApp;
