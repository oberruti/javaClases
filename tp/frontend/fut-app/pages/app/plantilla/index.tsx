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
import { Jugadores } from "../jugadores";
import { DropdownList, Multiselect } from "react-widgets";
import { ERRORES } from "../../../common/components/page/utils";
import ErrorMessage from "../../../common/components/ErrorMessage";

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

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

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
  club: string;
  jugadores: Jugadores;
};

interface Club {
  id: string;
  nombre: string;
  sigla: string;
  nacionalidad: string;
  userID: string;
}

interface Plantilla {
  id: string;
  nombre: string;
  tactica: string;
  esTitular: boolean;
  clubID: string;
  jugadoresIDs: string[];
}

type Plantillas = Plantilla[];

type PlantillasPageProps = {
  plantillas?: Plantillas;
  club?: Club;
  token?: string;
  plantillasYClub?: PlantillaRow[];
  listaJugadores?: Jugadores;
  criticalError?: string;
};

function PlantillaPage({
  plantillas = [],
  club,
  token = "",
  plantillasYClub = [],
  listaJugadores = [],
  criticalError,
}: PlantillasPageProps) {
  const router = useRouter();

  const TACTICAS = [
    {
      id: "442",
      value: "442",
    },
    {
      id: "433",
      value: "433",
    },
    {
      id: "4321",
      value: "4321",
    },
    {
      id: "532",
      value: "532",
    },
    {
      id: "4411",
      value: "4411",
    },
  ];

  const COLUMNS = useMemo<ColumnDef<PlantillaRow>[]>(
    () => [
      {
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              type="checkbox"
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: "Nombre",
        accessorKey: "nombre",
      },
      {
        header: "Tactica",
        accessorKey: "tactica",
      },
      {
        header: "Es plantilla Titular",
        accessorKey: "esTitular",
        cell: ({ row }) => (
          <input
            disabled
            type="checkbox"
            {...{
              checked: row.getValue("esTitular"),
            }}
          />
        ),
      },
      {
        header: "Club",
        accessorKey: "club",
      },
      {
        header: "Jugadores",
        accessorKey: "jugadores",
        cell: ({ row }) => (
          <div>
            {/* @ts-ignore */}
            {row.getValue("jugadores").map((jugador) => {
              return <div key={jugador.id}>{jugador.nombre}</div>;
            })}
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = useState(plantillasYClub);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [tactica, setTactica] = useState<{ id: string; value: string }>();
  const [esTitular, setEsTitular] = useState<undefined | boolean>(undefined);
  const [jugadores, setJugadores] = useState<Jugadores>([]);

  const columns = useMemo(() => COLUMNS, []);
  const [rowSelection, setRowSelection] = useState({});

  const onRowSelectionChange = (rowSelection: RowSelectionState) => {
    onCancel();
    setRowSelection(rowSelection);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableMultiRowSelection: false,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const esTitularDisabled =
    plantillas.some((plantilla) => plantilla.esTitular) &&
    !table.getSelectedRowModel().flatRows[0]?.original?.esTitular;
  const buttonsDisabled = Object.values(rowSelection).length == 0;

  const onEditSelection = () => {
    onCancel();
    const row = table.getSelectedRowModel().flatRows[0].original;
    setId(row.id);
    setNombre(row.nombre);
    setTactica(TACTICAS.find((value) => value.value === row.tactica));
    setEsTitular(row.esTitular);
    setJugadores(row.jugadores);
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
    setTactica(undefined);
    setEsTitular(undefined);
    setJugadores([]);
    setErrorMessage("");
    setIsAdding(false);
    setIsEditing(false);
  };

  const onConfirmSelected = async () => {
    if (isEditing) {
      const plantilla = {
        id,
        nombre,
        esTitular,
        tactica: tactica.value,
        clubID: club.id,
        jugadoresIDs: jugadores.map((jugador) => jugador.id),
      };
      const res = await fetch(
        `${process.env.BACKEND_URL}/plantilla/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(plantilla),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await res.json();
      if (data) {
        onCancel();
        router.reload();
      } else {
        setErrorMessage("No se pudo guardar la plantilla.");
      }
    } else {
      const plantilla = {
        nombre,
        esTitular,
        tactica: tactica.value,
        clubID: club.id,
        jugadoresIDs: jugadores.map((jugador) => jugador.id),
      };
      const res = await fetch(
        `${process.env.BACKEND_URL}/plantilla/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(plantilla),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await res.json();
      if (data) {
        onCancel();
        router.reload();
      } else {
        setErrorMessage("No se pudo guardar la plantilla.");
      }
    }
  };

  const onDeleteSelection = async () => {
    const id = table.getSelectedRowModel().flatRows[0].original.id;
    console.log("id", id);
    try {
      const resEliminarPlantilla = await fetch(
        `${process.env.BACKEND_URL}/plantilla/${id}/query?sessionToken=${token}`,
        {
          method: "delete",
        }
      );
      const eliminado = await resEliminarPlantilla.json();
      if (eliminado) {
        router.reload();
      } else {
        setErrorMessage("No se pudo eliminar la plantilla.");
      }
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };

  if (criticalError) {
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
        <div
          style={{
            display: "flex",
            alignContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
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
            Agregar Plantilla
          </button>
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
              opacity: buttonsDisabled ? "75%" : "100%",
              cursor: buttonsDisabled ? "default" : "pointer",
            }}
            disabled={buttonsDisabled}
            onClick={onEditSelection}
          >
            Editar seleccion
          </button>
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
              opacity: buttonsDisabled ? "75%" : "100%",
              cursor: buttonsDisabled ? "default" : "pointer",
            }}
            disabled={buttonsDisabled}
            onClick={onDeleteSelection}
          >
            Eliminar seleccion
          </button>
        </div>
        {(isEditing || isAdding) && (
          <VerticalStack style={{ marginTop: "100px" }}>
            <div style={styles.errorMessage}>{errorMessage}</div>
            <HorizontalStack style={{ display: "flex", alignSelf: "center" }}>
              <button style={styles.confirm} onClick={onConfirmSelected}>
                Confirmar
              </button>
              <button style={styles.cancel} onClick={onCancel}>
                Cancelar
              </button>
            </HorizontalStack>
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
            <div style={styles.maybeTitle}>Tactica</div>
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
                data={TACTICAS}
                dataKey="id"
                textField="value"
                value={tactica}
                onChange={setTactica}
              />
            </div>
            <div style={styles.maybeTitle}>"Es Titular"</div>
            <div style={styles.errorMessage}>
              {esTitularDisabled ? "Ya existe una plantilla titular" : ""}
            </div>
            <input
              disabled={esTitularDisabled}
              style={styles.input}
              type="checkbox"
              placeholder="Es Titular"
              name="esTitular"
              checked={esTitular}
              onChange={(event) => {
                setEsTitular(event.target.checked);
              }}
            />
            <div style={styles.maybeTitle}>Jugadores:</div>
            <div
              style={{
                minWidth: "50%",
                width: "50%",
                height: "1000px",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Multiselect
                style={{
                  minWidth: "100%",
                  alignSelf: "flex-start",
                }}
                dataKey="id"
                textField="nombre"
                data={listaJugadores}
                value={jugadores}
                onChange={(value, metadata) => {
                  if (jugadores.length < 16 || metadata.action === "remove") {
                    setJugadores(value);
                  }
                }}
                groupBy="posicion"
                renderListItem={({ item }) => {
                  if (jugadores.includes(item) || jugadores.length < 16) {
                    return (
                      <span>
                        <strong>{item.nombre}</strong>
                        {" " + item.nacionalidad}
                      </span>
                    );
                  }
                  return (
                    <span style={{ opacity: "75%", cursor: "default" }}>
                      <strong>{item.nombre}</strong>
                      {" " + item.nacionalidad}
                    </span>
                  );
                }}
              />
            </div>
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

  const resJugadores = await fetch(
    `${process.env.BACKEND_URL}/jugador/query?sessionToken=${token}`
  );
  const jugadores = await resJugadores.json();

  if (!resJugadores.ok) {
    if (
      jugadores.message === ERRORES.NO_CLUB ||
      jugadores.message === ERRORES.NO_SESSION
    ) {
      return {
        props: {
          criticalError: jugadores.message,
        },
      };
    }
  }

  // If user, stay here
  return {
    props: {
      plantillas,
      club,
      token,
      plantillasYClub: plantillasYClubJson,
      listaJugadores: jugadores,
    },
  };
};

export default PlantillaPage;
