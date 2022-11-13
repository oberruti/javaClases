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

const PIERNAS = [
  {
    id: "derecha",
    value: "derecha",
  },
  {
    id: "izquierda",
    value: "izquierda",
  },
  {
    id: "ambas",
    value: "ambas",
  },
];

export const POSICIONES = [
  {
    id: "arquero",
    value: "arquero",
  },
  {
    id: "defensor",
    value: "defensor",
  },
  {
    id: "mediocampista",
    value: "mediocampista",
  },
  {
    id: "delantero",
    value: "delantero",
  },
];

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

export type JugadorRow = {
  id: string;
  nombre: string;
  liga: string;
  nacionalidad: string;
  posicion: string;
  piernaBuena: string;
  edad: string;
  club: string;
};

interface Club {
  id: string;
  nombre: string;
  sigla: string;
  nacionalidad: string;
  userID: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  liga: string;
  nacionalidad: string;
  posicion: string;
  piernaBuena: string;
  edad: number;
  clubID: string;
}

export type Jugadores = Jugador[];

type JugadoresPageProps = {
  jugadores: Jugadores;
  club: Club;
  token: string;
};

function JugadoresPage({ jugadores, club, token }: JugadoresPageProps) {
  const router = useRouter();
  const jugadoresYClub = jugadores.map((jugador) => ({
    id: jugador.id,
    nombre: jugador.nombre,
    liga: jugador.liga,
    nacionalidad: jugador.nacionalidad,
    posicion: jugador.posicion,
    piernaBuena: jugador.piernaBuena,
    edad: jugador.edad.toString(),
    club: club.nombre,
  }));

  const COLUMNS = useMemo<ColumnDef<JugadorRow>[]>(
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

  const [data, setData] = useState(jugadoresYClub);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [liga, setLiga] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [posicion, setPosicion] = useState<{ id: string; value: string }>();
  const [piernaBuena, setPiernaBuena] = useState<{
    id: string;
    value: string;
  }>();
  const [edad, setEdad] = useState("");

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

  const buttonsDisabled = Object.values(rowSelection).length == 0;

  const onEditSelection = () => {
    onCancel();
    const row = table.getSelectedRowModel().flatRows[0].original;
    setId(row.id);
    setNombre(row.nombre);
    setLiga(row.liga);
    setNacionalidad(row.nacionalidad);
    setPosicion(POSICIONES.find((value) => value.value === row.posicion));
    setPiernaBuena(PIERNAS.find((value) => value.value === row.piernaBuena));
    setEdad(row.edad);
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
    setLiga("");
    setNacionalidad("");
    setPosicion(undefined);
    setPiernaBuena(undefined);
    setEdad("");
    setErrorMessage("");
    setIsAdding(false);
    setIsEditing(false);
  };

  const onConfirmSelected = async () => {
    if (isEditing) {
      const jugador = {
        id,
        nombre,
        edad: Number.parseInt(edad),
        nacionalidad,
        liga,
        posicion: posicion.value,
        piernaBuena: piernaBuena.value,
        clubID: club.id,
      };
      const res = await fetch(
        `https://java-tp-oberruti.herokuapp.com/jugador/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(jugador),
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
        setErrorMessage("No se pudo guardar el jugador.");
      }
    } else {
      const jugador = {
        nombre,
        edad: Number.parseInt(edad),
        nacionalidad,
        liga,
        posicion: posicion.value,
        piernaBuena: piernaBuena.value,
        clubID: club.id,
      };
      const res = await fetch(
        `https://java-tp-oberruti.herokuapp.com/jugador/query?sessionToken=${token}`,
        {
          method: "POST",
          body: JSON.stringify(jugador),
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
        setErrorMessage("No se pudo guardar el jugador.");
      }
    }
  };

  const onDeleteSelection = async () => {
    const id = table.getSelectedRowModel().flatRows[0].original.id;
    console.log("id", id);
    try {
      const resEliminarJugadores = await fetch(
        `https://java-tp-oberruti.herokuapp.com/jugador/${id}/query?sessionToken=${token}`,
        {
          method: "delete",
        }
      );
      const eliminado = await resEliminarJugadores.json();
      if (eliminado) {
        router.reload();
      } else {
        setErrorMessage("No se pudo eliminar el jugador.");
      }
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };

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
            Agregar Jugador
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
            <div style={styles.maybeTitle}>{liga == "" ? <></> : "Liga"}</div>
            <input
              style={styles.input}
              placeholder="Liga"
              name="liga"
              value={liga}
              onChange={(event) => {
                setLiga(event.target.value);
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
            <div style={styles.maybeTitle}>Posicion</div>
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
                value={posicion}
                onChange={setPosicion}
              />
            </div>
            <div style={styles.maybeTitle}>Pierna Buena</div>
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
                data={PIERNAS}
                dataKey="id"
                textField="value"
                value={piernaBuena}
                onChange={setPiernaBuena}
              />
            </div>
            <div style={styles.maybeTitle}>{edad == "" ? <></> : "Edad"}</div>
            <input
              style={styles.input}
              placeholder="Edad"
              name="edad"
              value={edad}
              onChange={(event) => {
                setEdad(event.target.value);
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
  const resJugadores = await fetch(
    `https://java-tp-oberruti.herokuapp.com/jugador/query?sessionToken=${token}`
  );
  const jugadores = await resJugadores.json();

  const resClub = await fetch(
    `https://java-tp-oberruti.herokuapp.com/club/query?sessionToken=${token}`
  );
  const club = await resClub.json();

  // If user, stay here
  return { props: { jugadores, club, token } };
};

export default JugadoresPage;
