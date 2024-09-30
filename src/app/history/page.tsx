/* eslint-disable react/jsx-curly-newline */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */

"use client";

import React, { useEffect, useState } from "react";
import { useHistorySelector } from "@/store/useTask";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";

import styles from "./page.module.css";

function IconButton({
  onClick,
  children,
}: React.PropsWithChildren<{ onClick: (e?: React.MouseEvent) => void }>) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };
  return (
    <div
      role="button"
      className={styles.clearButton}
      tabIndex={0} // Permite que el elemento sea enfocado con teclado
      onClick={onClick}
      onKeyDown={handleKeyDown} // Escucha eventos del teclado
      style={{ cursor: "pointer" }}
      aria-label="Clear selection" // Asegura que sea descriptivo para lectores de pantalla
    >
      {children}
    </div>
  );
}
const CrossIcon = React.memo(() => (
  <div className={styles.crossIconContainer}>
    <div
      className={`${styles.crossIconLine} ${styles.crossIconLineDiagonal1}`}
    />
    <div
      className={`${styles.crossIconLine} ${styles.crossIconLineDiagonal2}`}
    />
  </div>
));

function History() {
  const history = useHistorySelector();

  const [data, setData] = useState<
    {
      primaryTaskId: number;
      incidentId?: number;
      action: "add" | "edit" | "delete" | "add-incident";
      timestamp: string;
    }[]
  >([]);

  const { control, setValue } = useForm<{ search: string; filter: string }>();

  useEffect(() => {
    setData(history);
  }, [history]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.searchFixed}>
          <h1 className={styles.title}>Historial de acciones</h1>
          <section className={styles.search}>
            <Controller
              name="search"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  name="search"
                  placeholder="Buscar tareas"
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  value={value ?? ""}
                  rightIcon={
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => {
                        setValue("search", "");
                      }}
                    >
                      <CrossIcon />
                    </button>
                  }
                />
              )}
            />

            <Controller
              name="filter"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  list={[
                    { id: 1, name: "Pendiente", state: "pending" },
                    { id: 2, name: "Completado", state: "completed" },
                  ]}
                  renderLabel={(item) => item.name}
                  renderKey={(item) => item.id}
                  onSelect={(option) => {
                    onChange(option.name);
                  }}
                >
                  <Input
                    name="filter"
                    placeholder="Filtrar por estado"
                    value={value ?? ""}
                    readOnly
                    rightIcon={
                      <IconButton
                        onClick={(e) => {
                          e?.stopPropagation();
                          setValue("filter", "");
                        }}
                      >
                        <CrossIcon />
                      </IconButton>
                    }
                  />
                </Dropdown>
              )}
            />
          </section>
        </section>

        <section className={styles.tasks}>
          {data.length === 0 ? (
            <p>No hay historial disponibles.</p>
          ) : (
            data.map((task) => (
              <div key={task.primaryTaskId} className={styles.task}>
                <h2>{task.primaryTaskId}</h2>
                {task.incidentId ? <h2>{task.incidentId}</h2> : undefined}
                <h2>{task.action}</h2>
                <h2>{task.timestamp}</h2>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default History;
