/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TFormData, useFormStore } from "@/store/formState";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";

import styles from "./page.module.css";

const debounce = <T extends (...args: [string]) => void>(
  callback: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  const debouncedFn = (...args: [string]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFn;
};

type OptionType = {
  id: number;
  name: string;
  state: string;
};

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

function Tasks() {
  const { formData, deleteTask } = useFormStore();
  const [data, setData] = useState<TFormData[]>([]);
  const [dataSearched, setDataSearched] = useState<TFormData[]>([]);
  const [dataFiltered, setDataFiltered] = useState<TFormData[]>([]);
  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });

  const router = useRouter();

  const { control, setValue } = useForm<{ search: string; filter: string }>();

  const handleOnSearch = useCallback(
    debounce((searchValue: string) => {
      if (!searchValue && dataFiltered.length > 0) {
        setData(dataFiltered);
      } else if (!searchValue) {
        setData(formData);
        setDataSearched([]);
      } else {
        const filteredData = data.filter(
          (task) =>
            task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            task.description.toLowerCase().includes(searchValue.toLowerCase())
        );
        setData(filteredData);
        setDataSearched(filteredData);
      }
    }, 300),
    [data, dataFiltered]
  );

  const handleOnFilter = useCallback(
    (value: OptionType["state"]) => {
      if (!value) {
        setData(dataSearched.length > 0 ? dataSearched : formData);
        setDataFiltered([]);
      } else {
        const filteredData = (
          dataSearched.length > 0 ? dataSearched : formData
        ).filter((item) => item.state === value);
        if (filteredData.length === 0) return;
        setData(filteredData);
        setDataFiltered(filteredData);
      }
    },
    [dataSearched, formData]
  );

  const handleOnDelete = useCallback(
    (id: number | null) => {
      try {
        if (!id) {
          throw new Error("No se pudo eliminar la tarea");
        }
        deleteTask(id);
        setModalStatus({ isOpen: false, id: null });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [deleteTask]
  );

  useEffect(() => {
    setData(formData);
  }, [formData]);

  const newData = data;

  return (
    <div className={styles.container}>
      {modalStatus.isOpen && (
        <section className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <IconButton
                onClick={() => setModalStatus({ isOpen: false, id: null })}
              >
                <CrossIcon />
              </IconButton>
            </div>

            <button
              type="button"
              className={styles.taskAction}
              onClick={() => router.push(`/tasks/${modalStatus.id}`)}
            >
              Editar tarea
            </button>
            <button
              type="button"
              className={styles.taskAction}
              onClick={() => handleOnDelete(modalStatus.id)}
            >
              Eliminar tarea
            </button>
          </div>
        </section>
      )}
      <main className={styles.main}>
        <section className={styles.searchFixed}>
          <h1 className={styles.title}>Listado de tareas</h1>
          <section className={styles.search}>
            <Controller
              name="search"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  name="search"
                  placeholder="Buscar tareas"
                  onChange={(e) => {
                    handleOnSearch(e.target.value);
                    onChange(e.target.value);
                  }}
                  value={value ?? ""}
                  leftIcon={
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => {
                        setValue("search", "");
                        handleOnSearch("");
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
                    handleOnFilter(option.state);
                    onChange(option.name);
                  }}
                >
                  <Input
                    name="filter"
                    placeholder="Filtrar por estado"
                    value={value ?? ""}
                    readOnly
                    leftIcon={
                      <IconButton
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleOnFilter("");
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
          {newData.length === 0 ? (
            <p>No hay tareas disponibles.</p>
          ) : (
            newData.map((task) => (
              <div key={task.id} className={styles.task}>
                <div className={styles.taskContent}>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                </div>
                <div>
                  <button
                    type="button"
                    className={styles.taskAction}
                    onClick={() => {
                      if (task.id)
                        setModalStatus({ isOpen: true, id: task.id });
                    }}
                  >
                    Abrir
                  </button>

                  <p>Estado: {task.state}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Tasks;
