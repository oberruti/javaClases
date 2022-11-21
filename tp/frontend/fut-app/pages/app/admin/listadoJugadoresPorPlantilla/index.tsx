import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { Layout } from "../../../../common/components/page";
import { COLORS, FONTS } from "../../../../styles/style";
import React from "react";
import {
  HorizontalCentered,
  VerticalStack,
} from "../../../../common/components/flex";
import { StyleMap } from "../../../../common/utils/tsTypes";
import { Jugadores, JugadorRow } from "../jugadores";
import { DropdownList } from "react-widgets";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import { ERRORES } from "../../../../common/components/page/utils";
import { Club } from "../club";

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

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

type PlantillaRow = {
  id: string;
  nombre: string;
  tactica: string;
  esTitular: boolean;
  club: Club;
  jugadores: Jugadores;
};

type ListadoJugadoresPorPlantillaPageProps = {
  criticalError?: string;
  plantillasYClub?: PlantillaRow[];
  isAdmin?: boolean;
};

function listadoJugadoresPorPlantillaPage({
  plantillasYClub = [],
  criticalError,
  isAdmin,
}: ListadoJugadoresPorPlantillaPageProps) {
  const COLUMNS = useMemo<ColumnDef<JugadorRow>[]>(
    () => [
      {
        header: "Nombre",
        accessorKey: "nombre",
      },
      {
        header: "Liga",
        accessorKey: "liga",
      },
      {
        header: "Nacionalidad",
        accessorKey: "nacionalidad",
      },
      {
        header: "Posicion",
        accessorKey: "posicion",
      },
      {
        header: "Pierna Buena",
        accessorKey: "piernaBuena",
      },
      {
        header: "Edad",
        accessorKey: "edad",
      },
      {
        header: "Club",
        accessorKey: "club",
        cell: ({ row }) => (
          <div>
            {/* @ts-ignore */}
            <div key={row.getValue("club")?.id}>
              {/* @ts-ignore */}
              {row.getValue("club")?.nombre}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [plantillaSelected, setPlantillaSelected] = useState<PlantillaRow>();
  const jugadoresYClub = (plantillaSelected: PlantillaRow) =>
    plantillaSelected &&
    plantillaSelected.jugadores.map((jugador) => ({
      id: jugador.id,
      nombre: jugador.nombre,
      liga: jugador.liga,
      nacionalidad: jugador.nacionalidad,
      posicion: jugador.posicion,
      piernaBuena: jugador.piernaBuena,
      edad: jugador.edad.toString(),
      club: plantillaSelected.club,
    }));

  const [data, setData] = useState([]);

  const columns = useMemo(() => COLUMNS, []);

  const onChange = (value) => {
    setErrorMessage(undefined);
    const plantillaSelected = plantillasYClub.find(
      (plantilla) => plantilla.id === value.id
    );
    setPlantillaSelected(plantillaSelected);
    const jugadores = jugadoresYClub(plantillaSelected);
    if (jugadores.length > 0) {
      setData(jugadores);
    } else {
      setErrorMessage("No existen jugadores en esta plantilla.");
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (criticalError) {
    return (
      <Layout isAdmin={isAdmin}>
        <ErrorMessage message={criticalError} />
      </Layout>
    );
  }

  return (
    <Layout isAdmin={isAdmin}>
      <VerticalStack>
        <HorizontalCentered style={{ width: "100%" }}>
          <div
            style={{
              ...styles.maybeTitle,
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            Por favor seleccione la plantilla para listar sus jugadores
          </div>
        </HorizontalCentered>
        <div
          style={{
            minWidth: "50%",
            width: "50%",
            height: "100px",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <DropdownList
            data={plantillasYClub.map((object) => ({
              id: object.id,
              value: `${object.nombre} - ${object.club.nombre} - ${object.tactica}`,
            }))}
            dataKey="id"
            textField="value"
            value={plantillaSelected}
            onChange={onChange}
          />
        </div>
      </VerticalStack>
      {errorMessage ? (
        <div style={styles.errorMessage}>{errorMessage}</div>
      ) : (
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
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
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
        </div>
      )}
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

  //@ts-ignore
  if (!session.session.isAdmin) {
    return {
      props: {},
      redirect: {
        destination: "/app/dashboard",
        permanent: false,
      },
    };
  }

  const token = await getToken({ req, raw: true });

  const resClubes = await fetch(
    `${process.env.BACKEND_URL}/club/admin/query?sessionToken=${token}`
  );
  const clubes = await resClubes.json();

  if (!resClubes.ok) {
    if (
      clubes.message === ERRORES.NO_CLUB ||
      clubes.message === ERRORES.NO_SESSION
    ) {
      return {
        props: {
          criticalError: clubes.message,
          //@ts-ignore
          isAdmin: session.session.isAdmin,
        },
      };
    }
  }

  const resPlantillas = await fetch(
    `${process.env.BACKEND_URL}/plantilla/admin/query?sessionToken=${token}`
  );
  const plantillas = await resPlantillas.json();

  if (!resPlantillas.ok) {
    if (
      plantillas.message === ERRORES.NO_CLUB ||
      plantillas.message === ERRORES.NO_SESSION
    ) {
      return {
        props: {
          criticalError: plantillas.message,
          //@ts-ignore
          isAdmin: session.session.isAdmin,
        },
      };
    }
  }

  const getJugadoresByPlantillaID = async (id: String) => {
    const jugadoresByPlantillaIdRes = await fetch(
      `${process.env.BACKEND_URL}/plantilla/${id}/admin/jugadores/query?sessionToken=${token}`
    );
    const jugadoresByPlantillaId = await jugadoresByPlantillaIdRes.json();

    if (!jugadoresByPlantillaIdRes.ok) {
      {
        return {
          criticalError: jugadoresByPlantillaId.message,
        };
      }
    }

    if (jugadoresByPlantillaId) {
      return jugadoresByPlantillaId;
    }
    return [];
  };

  const getPlantillaByPlantilla = async (plantilla) => {
    const jugadores = await getJugadoresByPlantillaID(plantilla.id);
    if (jugadores.criticalError) {
      return jugadores;
    }
    return {
      id: plantilla.id,
      nombre: plantilla.nombre,
      tactica: plantilla.tactica,
      esTitular: plantilla.esTitular,
      club: clubes.find((club) => plantilla.clubID === club.id),
      jugadores,
    };
  };

  const plantillasYClub = async () => {
    const plantillasDone = [];

    for (var i = 0; i < plantillas.length; i++) {
      const plant = await getPlantillaByPlantilla(plantillas[i]);
      if (plant.criticalError) {
        return plant;
      }
      plantillasDone.push(plant);
    }

    return plantillasDone;
  };

  const plantillasYClubJson = await plantillasYClub();

  if (plantillasYClubJson.criticalError) {
    return {
      props: {
        criticalError: plantillasYClubJson.criticalError,
        //@ts-ignore
        isAdmin: session.session.isAdmin,
      },
    };
  }

  // If user, stay here
  return {
    props: {
      plantillasYClub: plantillasYClubJson,
      //@ts-ignore
      isAdmin: session.session.isAdmin,
    },
  };
};

export default listadoJugadoresPorPlantillaPage;
