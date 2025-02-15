import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { HTMLProps, useMemo, useRef, useState } from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { Layout } from "../../../common/components/page";
import { COLORS, FONTS } from "../../../styles/style";
import React from "react";
import { useRouter } from "next/router";
import {
  HorizontalStack,
  VerticalStack,
} from "../../../common/components/flex";
import { StyleMap } from "../../../common/utils/tsTypes";
import { DropdownList } from "react-widgets";
import { ERRORES } from "../../../common/components/page/utils";
import ErrorMessage from "../../../common/components/ErrorMessage";
import useRenderToast from "../useRenderToast";

const styles: StyleMap = {
  input: {
    height: "25px",
    width: "70%",
    borderBottom: `1px solid ${COLORS.green}`,
    borderTopStyle: "none",
    borderLeftStyle: "none",
    borderRightStyle: "none",
    fontSize: "14px",
    marginBottom: "6%",
    display: "flex",
    alignSelf: "center",
    fontFamily: FONTS.comments.fontFamily,
    background: COLORS.blue,
    color: COLORS.white,
    outline: "none",
    boxShadow: "none",
  },
  confirm: {
    height: "30px",
    border: "2px solid #75cb64",
    background: COLORS.blue,
    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.25)",
    color: "white",
    fontSize: "14px",
    marginTop: "2%",
    marginBottom: "4%",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    width: "100px",
    fontFamily: FONTS.comments.fontFamily,
    marginRight: "100px",
  },
  cancel: {
    height: "30px",
    border: "2px solid #cb6464",
    background: COLORS.blue,
    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.25)",
    color: "white",
    fontSize: "14px",
    marginTop: "2%",
    marginBottom: "4%",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    width: "100px",
    fontFamily: FONTS.comments.fontFamily,
  },
  title: {
    marginTop: "3%",
    marginBottom: "3%",
    textAlign: "center",
    color: "white",
    fontSize: "20px",
    fontFamily: FONTS.comments.fontFamily,
    borderBottom: `1px solid ${COLORS.green}`,
    width: "200px",
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
  },
  errorMessage: {
    fontFamily: FONTS.comments.fontFamily,
    fontStyle: FONTS.comments.fontStyle,
    fontSize: FONTS.comments.fontSize,
    fontWeight: FONTS.comments.fontWeight,
    color: COLORS.rose,
    textAlign: "center",
    width: "100%",
    margin: "10px",
  },
  maybeTitle: {
    maxHeight: "15px",
    height: "auto",
    width: "70%",
    color: COLORS.green,
    borderTopStyle: "none",
    borderLeftStyle: "none",
    borderRightStyle: "none",
    fontSize: "14px",
    marginBottom: "0.5%",
    display: "flex",
    alignSelf: "center",
    fontFamily: FONTS.comments.fontFamily,
    background: COLORS.blue,
    outline: "none",
    boxShadow: "none",
  },
};

interface Club {
  id: string;
  nombre: string;
  sigla: string;
  nacionalidad: string;
  userID: string;
}

type ClubPageProps = {
  club?: Club;
  token?: string;
  criticalError?: string;
  userID?: string;
};

function ClubPage({ club, token = "", criticalError, userID }: ClubPageProps) {
  const router = useRouter();
  const renderToast = useRenderToast();

  const COLUMNS = useMemo<ColumnDef<Club>[]>(
    () => [
      {
        header: "Nombre",
        accessorKey: "nombre",
      },
      {
        header: "Sigla",
        accessorKey: "sigla",
      },
      {
        header: "Nacionalidad",
        accessorKey: "nacionalidad",
      },
    ],
    []
  );

  const array = [];
  if (!!club) {
    array.push(club);
  }
  const [data, setData] = useState(array);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [sigla, setSigla] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  const columns = useMemo(() => COLUMNS, []);
  const [rowSelection, setRowSelection] = useState({});

  const onRowSelectionChange = (rowSelection: RowSelectionState) => {
    onCancel();
    setRowSelection(rowSelection);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onEditSelection = () => {
    onCancel();
    setId(club.id);
    setNombre(club.nombre);
    setSigla(club.sigla);
    setNacionalidad(club.nacionalidad);
    setIsAdding(false);
    setIsEditing(true);
  };

  const onAdding = () => {
    onRowSelectionChange({});
    onCancel();
    setIsAdding(true);
  };

  const onCancel = () => {
    setId("");
    setNombre("");
    setSigla("");
    setNacionalidad("");
    setErrorMessage("");
    setIsAdding(false);
    setIsEditing(false);
  };

  const onConfirmSelected = async () => {
    if (isEditing) {
      const club = {
        id,
        nombre,
        nacionalidad,
        sigla,
        userID: userID || array[0].userID,
      };
      renderToast("loading", "Guardando Club modificado");
      const res = await fetch(
        `${process.env.BACKEND_URL}/club/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(club),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        renderToast("error", data.message);
      } else {
        if (data) {
          renderToast("success", "Club modificado correctamente", () => {
            onCancel();
            router.reload();
          });
        } else {
          renderToast("error", "No se pudo guardar el club.");
        }
      }
    } else {
      const club = {
        nombre,
        nacionalidad,
        sigla,
        userID,
      };

      renderToast("loading", "Guardando Club nuevo");
      const res = await fetch(
        `${process.env.BACKEND_URL}/club/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(club),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        renderToast("error", data.message);
      } else {
        if (data) {
          renderToast("success", "Club creado correctamente", () => {
            onCancel();
            router.reload();
          });
        } else {
          renderToast("error", "No se pudo guardar el Club.");
        }
      }
    }
  };

  if (criticalError && criticalError !== ERRORES.NO_CLUB) {
    return (
      <Layout>
        <ErrorMessage message={criticalError} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      border: `1px solid ${COLORS.green}`,
                      textAlign: "left",
                      padding: "8px",
                      color: "white",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        style={{
                          border: `1px solid ${COLORS.green}`,
                          textAlign: "left",
                          padding: "8px",
                          color: "white",
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          {criticalError && (
            <button
              style={{
                border: `1px solid ${COLORS.green}`,
                margin: "10px",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: "15px",
                paddingRight: "15px",
                borderRadius: "3px",
                backgroundColor: "white",
                color: COLORS.blue,
                opacity: "100%",
                cursor: "pointer",
              }}
              onClick={onAdding}
            >
              Agregar club
            </button>
          )}
          {!criticalError && (
            <button
              style={{
                border: `1px solid ${COLORS.green}`,
                margin: "10px",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: "15px",
                paddingRight: "15px",
                borderRadius: "3px",
                backgroundColor: "white",
                color: COLORS.blue,
                opacity: "100%",
                cursor: "pointer",
              }}
              onClick={onEditSelection}
            >
              Editar club
            </button>
          )}
        </div>
        {(isEditing || isAdding) && (
          <VerticalStack style={{ marginTop: "100px" }}>
            <div style={styles.maybeTitle}>
              {nombre == "" ? <></> : "Nombre"}
            </div>
            <input
              style={styles.input}
              placeholder="Nombre"
              name="nombre"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
              }}
            />
            <div style={styles.maybeTitle}>{sigla == "" ? <></> : "Sigla"}</div>
            <input
              style={styles.input}
              placeholder="Sigla"
              name="sigla"
              value={sigla}
              onChange={(event) => {
                setSigla(event.target.value);
              }}
            />
            <div style={styles.maybeTitle}>
              {nacionalidad == "" ? <></> : "Nacionalidad"}
            </div>
            <input
              style={styles.input}
              placeholder="Nacionalidad"
              name="nacionalidad"
              value={nacionalidad}
              onChange={(event) => {
                setNacionalidad(event.target.value);
              }}
            />
            <div style={styles.errorMessage}>{errorMessage}</div>
            <HorizontalStack style={{ display: "flex", alignSelf: "center" }}>
              <button style={styles.confirm} onClick={onConfirmSelected}>
                Confirmar
              </button>
              <button style={styles.cancel} onClick={onCancel}>
                Cancelar
              </button>
            </HorizontalStack>
          </VerticalStack>
        )}
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

  const resClub = await fetch(
    `${process.env.BACKEND_URL}/club/query?sessionToken=${token}`
  );
  const club = await resClub.json();

  if (!resClub.ok) {
    if (
      club.message === ERRORES.NO_CLUB ||
      club.message === ERRORES.NO_SESSION
    ) {
      return {
        props: {
          criticalError: club.message,
          token,
          //@ts-ignore
          userID: session.user.id,
        },
      };
    }
  }

  // If user, stay here
  return { props: { club, token } };
};

export default ClubPage;
