import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Layout } from "../../../common/components/page";
import { COLORS, FONTS } from "../../../styles/style";
import React from "react";
import {
  HorizontalCentered,
  VerticalStack,
} from "../../../common/components/flex";
import { StyleMap } from "../../../common/utils/tsTypes";
import { Jugadores, JugadorRow, POSICIONES } from "../jugadores";
import { DropdownList } from "react-widgets";

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

type PlantillaRow = {
  id: string;
  nombre: string;
  tactica: string;
  esTitular: boolean;
  club: string;
  jugadores: Jugadores;
};

type ListadoJugadoresPorPlantillaPageProps = {
  token: string;
  plantillasYClub: PlantillaRow[];
};

function jugadorIdealPage({
  token,
  plantillasYClub,
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
      },
    ],
    []
  );

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [plantillaSelected, setPlantillaSelected] = useState<PlantillaRow>();
  const [posicionSelected, setPosicionSelected] = useState<{
    id: string;
    value: string;
  }>();

  const getJugadorIdeal = async () => {
    if (posicionSelected) {
      const jugadoresRes = await fetch(
        `https://java-tp-oberruti.herokuapp.com/jugador/${plantillaSelected.id}/${posicionSelected.value}/query?sessionToken=${token}`
      );
      const jugadores = await jugadoresRes.json();
      if (jugadores.length > 0) {
        const jugador = jugadores[0];
        return {
          id: jugador.id,
          nombre: jugador.nombre,
          liga: jugador.liga,
          nacionalidad: jugador.nacionalidad,
          posicion: jugador.posicion,
          piernaBuena: jugador.piernaBuena,
          edad: jugador.edad.toString(),
          club: plantillaSelected.club,
        };
      }
      return [];
    } else {
      console.log("error");
    }
  };

  const [data, setData] = useState([]);

  const columns = useMemo(() => COLUMNS, []);

  const onChange = (value) => {
    setErrorMessage(undefined);
    setPosicionSelected(undefined);
    const plantillaSelected = plantillasYClub.find(
      (plantilla) => plantilla.id === value.id
    );
    setPlantillaSelected(plantillaSelected);
  };

  const onChangePosiciones = (value) => {
    setErrorMessage(undefined);
    const posicionSelected = POSICIONES.find(
      (posicion) => posicion.id === value.id
    );
    setPosicionSelected(posicionSelected);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log("entra aca");
    const getData = async () => {
      const jugadores = await getJugadorIdeal();
      if (Array.isArray(jugadores) && jugadores.length === 0) {
        setErrorMessage(
          "No existe jugador ideal para esta posicion en esta plantilla."
        );
      }
      setData([jugadores]);
    };
    if (posicionSelected) {
      getData();
    } else {
      setData([]);
    }
  }, [posicionSelected]);

  return (
    <Layout>
      <VerticalStack>
        <HorizontalCentered style={{ width: "100%" }}>
          <div
            style={{
              ...styles.maybeTitle,
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            Por favor seleccione la plantilla para buscar el jugador ideal
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
              value: `${object.nombre} - ${object.club} - ${object.tactica}`,
            }))}
            dataKey="id"
            textField="value"
            value={plantillaSelected}
            onChange={onChange}
          />
        </div>

        <HorizontalCentered style={{ width: "100%" }}>
          <div
            style={{
              ...styles.maybeTitle,
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            Por favor seleccione la posicion para buscar el jugador ideal
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
            data={POSICIONES}
            dataKey="id"
            textField="value"
            value={posicionSelected}
            onChange={onChangePosiciones}
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

  const token = await getToken({ req, raw: true });
  const resPlantillas = await fetch(
    `https://java-tp-oberruti.herokuapp.com/plantilla/query?sessionToken=${token}`
  );
  const plantillas = await resPlantillas.json();

  const resClub = await fetch(
    `https://java-tp-oberruti.herokuapp.com/club/query?sessionToken=${token}`
  );
  const club = await resClub.json();

  const getJugadoresByPlantillaID = async (id: String) => {
    const jugadoresByPlantillaIdRes = await fetch(
      `https://java-tp-oberruti.herokuapp.com/plantilla/${id}/jugadores/query?sessionToken=${token}`
    );
    const jugadoresByPlantillaId: Jugadores =
      await jugadoresByPlantillaIdRes.json();
    if (jugadoresByPlantillaId) {
      return jugadoresByPlantillaId;
    }
    return [];
  };

  const getPlantillaByPlantilla = async (plantilla) => {
    const jugadores = await getJugadoresByPlantillaID(plantilla.id);
    return {
      id: plantilla.id,
      nombre: plantilla.nombre,
      tactica: plantilla.tactica,
      esTitular: plantilla.esTitular,
      club: club.nombre,
      jugadores,
    };
  };

  const plantillasYClub = async () => {
    const plantillasDone = [];

    for (var i = 0; i < plantillas.length; i++) {
      const plant = await getPlantillaByPlantilla(plantillas[i]);
      plantillasDone.push(plant);
    }

    return plantillasDone;
  };

  const plantillasYClubJson = await plantillasYClub();

  // If user, stay here
  return {
    props: {
      token,
      plantillasYClub: plantillasYClubJson,
    },
  };
};

export default jugadorIdealPage;
