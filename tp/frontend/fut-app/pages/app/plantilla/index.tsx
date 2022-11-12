import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth/core/types";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { Layout } from "../../../common/components/page";

function PlantillaPage({ data, session }: { data: any; session: Session }) {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {session.user.name}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: any) => {
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

  const token = await getToken({ req, raw: true });
  const ress = await fetch(
    `http://localhost:8080/plantilla/query?sessionToken=${token}`
  );
  const data = await ress.json();

  // If user, stay here
  return { props: { data, session } };
};

export default PlantillaPage;
