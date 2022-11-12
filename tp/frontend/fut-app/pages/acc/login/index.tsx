import { Style, StyleMap } from '../../../common/utils/tsTypes';
import React from 'react';
import { useRouter } from 'next/router';
import {
  HorizontalStack,
  VerticalStack,
} from '../../../common/components/flex';
import { COLORS, FONTS } from '../../../styles/style';
import { GetServerSideProps } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react';
import { PAGES } from '../../../common/components/page/utils';

const Login = (): JSX.Element | null => {
  const { status } = useSession();
  const router = useRouter();

  if (typeof window !== 'undefined' && status === 'loading') return null;

  const { fontSize, fontFamily, fontWeight } = FONTS.title;

  const styles: StyleMap = {
    background: {
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      height: '100%',
      minWidth: '1080px',
      minHeight: '720px',
      background: '#361999',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    whiteBox: {
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '10px',
      fontSize,
      color: '#FFFFFF',
      fontFamily,
      fontWeight,
      width: '500px',
      margin: '30px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      height: '500px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.background}>
      <HorizontalStack style={styles.content}>
        <div style={styles.whiteBox}>
          Bienvenido a tu FUT app.
          <LittleText />
          <SignInButton />
        </div>
      </HorizontalStack>
    </div>
  );
};

const LittleText = (): JSX.Element => {
  const { fontSize, fontFamily, fontWeight, fontStyle } = FONTS.comments;
  const style: Style = {
    marginTop: '20px',
    alignSelf: 'center',
    borderRadius: '10px',
    padding: '10px',
    fontSize,
    color: COLORS.white,
    fontFamily,
    fontStyle,
    fontWeight,
  };
  return <div style={style}>Por favor,</div>;
};

const SignInButton = (): JSX.Element => {
  const style: Style = {
    width: '320px',
    height: '42px',
    background: COLORS.blue,
    borderWidth: 'small',
    borderColor: COLORS.green,
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '7px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: FONTS.title.fontFamily,
    fontSize: '27px',
    color: COLORS.green,
    cursor: 'pointer',
  };
  return (
    <VerticalStack style={{ alignSelf: 'center' }}>
      <button
        style={style}
        onClick={() =>
          signIn('google', {
            callbackUrl: `${process.env.NEXTAUTH_URL}/app/${PAGES.DASHBOARD}`,
          })
        }
      >
        Sign In
      </button>
    </VerticalStack>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (session) {
    // If user, redirect to dashboard
    return {
      props: {},
      redirect: {
        destination: '/app/dashboard',
        permanent: false,
      },
    };
  }

  // If not user, stay here
  return { props: {} };
};

export default Login;
