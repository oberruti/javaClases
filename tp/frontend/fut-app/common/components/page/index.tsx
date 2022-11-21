import React, { CSSProperties } from "react";

import Link from "next/link";
import { PAGES } from "./utils";
import { HorizontalStack } from "../flex";
import { JustChildren } from "../../utils/tsTypes";
import { COLORS } from "../../../styles/style";
import { signOut } from "next-auth/react";
import { v4 } from "uuid";
import { ToastContainer } from "react-toastify";

export function Menu(props: { name: string; id: string }): JSX.Element {
  const dimensions: CSSProperties = {
    marginTop: "20px",
    alignSelf: "center",
    borderBottomColor: "white",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  };

  const linkStyle: CSSProperties = {
    color: "white",
    textDecoration: "none",
    textDecorationColor: "white",
    textEmphasisColor: "white",
    cursor: "pointer",
  };
  return (
    <div style={dimensions} key={props.id}>
      <Link href={props.name}>
        <div style={linkStyle}>
          {props.name === "listadoJugadoresPorPlantilla"
            ? "Listado Jug".toUpperCase()
            : props.name === "jugadorIdeal"
            ? "Jugador Ideal".toUpperCase()
            : props.name === "listadoDTsPorNac"
            ? "Listado DTS".toUpperCase()
            : props.name === "dtIdeal"
            ? "DT IDEAL".toUpperCase()
            : props.name.toUpperCase()}
        </div>
      </Link>
    </div>
  );
}

export const Logout = (): JSX.Element => {
  const dimensions: CSSProperties = {
    marginTop: "20px",
    alignSelf: "center",
    borderBottomColor: "white",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  };
  const linkStyle: CSSProperties = {
    color: "white",
    textDecoration: "none",
    textDecorationColor: "white",
    textEmphasisColor: "white",
    cursor: "pointer",
  };
  return (
    <div
      style={dimensions}
      onClick={() =>
        signOut({
          callbackUrl: `${process.env.NEXTAUTH_URL}/acc/login`,
        })
      }
    >
      <div style={linkStyle}>LOGOUT</div>
    </div>
  );
};

export function Navigation(): JSX.Element {
  const style: CSSProperties = {
    backgroundColor: COLORS.blue,
    width: "150px",
    height: "auto",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    borderRightStyle: "solid",
    borderRightColor: COLORS.green,
    borderRightWidth: "1px",
  };
  return (
    <div style={style}>
      {Object.values(PAGES).map((page) => (
        <Menu name={page} id={v4()} />
      ))}
      <Logout />
    </div>
  );
}

function AppContent(props: JustChildren): JSX.Element {
  const style: CSSProperties = {
    backgroundColor: COLORS.blue,
    width: "calc(100% - 150px)",
    minWidth: "1280px",
  };
  return <div style={style}>{props.children}</div>;
}

export const Layout = (props: JustChildren): JSX.Element => {
  const style: CSSProperties = {
    position: "absolute",
    backgroundColor: COLORS.blue,
    height: "auto",
    minHeight: "calc(100% - 2px)",
    minWidth: "calc(100% - 3px)",
    width: "calc(100% - 3px)",
    top: 0,
    left: 0,
    borderStyle: "solid",
    borderColor: COLORS.green,
    borderWidth: "1px",
  };
  return (
    <HorizontalStack style={style}>
      <Navigation />
      <AppContent>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {props.children}
      </AppContent>
    </HorizontalStack>
  );
};
