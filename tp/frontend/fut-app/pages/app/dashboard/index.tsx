import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Layout } from "../../../common/components/page";

function DashboardPage({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <Layout isAdmin={isAdmin}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Bienvenido al gestor de Ultimate Team !
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    // If not user, redirect to login
    return {
      props: {},
      redirect: {
        destination: "/acc/login",
        permanent: false,
      },
    };
  }

  // If user, stay here
  //@ts-ignore
  return { props: { isAdmin: session.session.isAdmin } };
};

export default DashboardPage;
