import { GetServerSideProps } from 'next';
import { Layout } from '../../../common/components/page';

function DashboardPage() {
  return <Layout>Dashboard</Layout>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const session = await getSession({ req });

  // if (!session) {

  if (false) {
    // If not user, redirect to login
    return {
      props: {},
      redirect: {
        destination: '/acc/login',
        permanent: false,
      },
    };
  }

  // If user, stay here
  return { props: {} };
};

export default DashboardPage;
