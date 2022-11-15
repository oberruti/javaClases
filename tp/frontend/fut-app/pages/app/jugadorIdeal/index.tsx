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
import { Jugador, Jugadores, JugadorRow, POSICIONES } from "../jugadores";
import { DropdownList } from "react-widgets";
import ErrorMessage from "../../../common/components/ErrorMessage";
import { ERRORES } from "../../../common/components/page/utils";
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

type PlantillaRow = {
  id: string;
  nombre: string;
  tactica: string;
  esTitular: boolean;
  club: string;
  jugadores: Jugadores;
};

type ListadoJugadoresPorPlantillaPageProps = {
  token?: string;
  plantillasYClub?: PlantillaRow[];
  criticalError?: string;
};

function jugadorIdealPage({
  token = "",
  plantillasYClub = [],
  criticalError,
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

  const renderToast = useRenderToast();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [plantillaSelected, setPlantillaSelected] = useState<PlantillaRow>();
  const [posicionSelected, setPosicionSelected] = useState<{
    id: string;
    value: string;
  }>();

  const getNacionalidades = (plantillaSelected: PlantillaRow) => {
    const nacionalidadesDeJugadoresDeLaPlantilla =
      plantillaSelected.jugadores.map((jugador) => jugador.nacionalidad);
    var nacionalidades = [];
    nacionalidadesDeJugadoresDeLaPlantilla.forEach((nacionalidad) => {
      if (
        nacionalidades.some(
          (nacionalidadCount, index) =>
            nacionalidad === nacionalidadCount.nacionalidad
        )
      ) {
        nacionalidades = nacionalidades.map((nacionalidadInterno) => {
          if (nacionalidadInterno.nacionalidad === nacionalidad) {
            return {
              nacionalidad,
              cuenta: nacionalidadInterno.cuenta + 1,
            };
          }
          return nacionalidadInterno;
        });
      } else {
        nacionalidades.push({
          nacionalidad,
          cuenta: 1,
        });
      }
    });
    console.log("las nacionaldiades son ", nacionalidades);
    return nacionalidades;
  };

  const getJugadorIdealByNacionalidadesYJugadores = (
    jugadores: Jugadores,
    nacionalidades: { nacionalidad: string; cuenta: number }[]
  ) => {
    const nacionalidadesDeJugadores = jugadores.map(
      (jugador) => jugador.nacionalidad
    );
    const nacionSeleccionada = nacionalidades.find((nacionalidad) => {
      if (nacionalidadesDeJugadores.includes(nacionalidad.nacionalidad)) {
        return nacionalidad;
      }
    });
    if (nacionSeleccionada) {
      return jugadores.find(
        (jugador) => jugador.nacionalidad === nacionSeleccionada.nacionalidad
      );
    }
    return jugadores[0];
  };

  const getJugadorIdeal = async () => {
    if (posicionSelected) {
      const jugadoresRes = await fetch(
        `${process.env.BACKEND_URL}/jugador/${plantillaSelected.id}/${posicionSelected.value}/query?sessionToken=${token}`
      );
      const jugadores = await jugadoresRes.json();
      if (!jugadoresRes.ok) {
        renderToast("error", jugadores.message);
      } else {
        if (jugadores.length > 0) {
          const nacionalidades = getNacionalidades(plantillaSelected);
          const jugadorIdeal = getJugadorIdealByNacionalidadesYJugadores(
            jugadores,
            nacionalidades
          );
          return {
            id: jugadorIdeal.id,
            nombre: jugadorIdeal.nombre,
            liga: jugadorIdeal.liga,
            nacionalidad: jugadorIdeal.nacionalidad,
            posicion: jugadorIdeal.posicion,
            piernaBuena: jugadorIdeal.piernaBuena,
            edad: jugadorIdeal.edad.toString(),
            club: plantillaSelected.club,
          };
        }
        return [];
      }
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

  if (criticalError) {
    return (
      <Layout>
        <ErrorMessage message={criticalError} />
      </Layout>
    );
  }

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
        },
      };
    }
  }

  const resPlantillas = await fetch(
    `${process.env.BACKEND_URL}/plantilla/query?sessionToken=${token}`
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
        },
      };
    }
  }

  const getJugadoresByPlantillaID = async (id: String) => {
    const jugadoresByPlantillaIdRes = await fetch(
      `${process.env.BACKEND_URL}/plantilla/${id}/jugadores/query?sessionToken=${token}`
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
      club: club.nombre,
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
      },
    };
  }

  // If user, stay here
  return {
    props: {
      token,
      plantillasYClub: plantillasYClubJson,
    },
  };
};

export default jugadorIdealPage;
