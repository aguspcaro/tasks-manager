/* eslint-disable react/jsx-curly-newline */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TFormData, useAllTasksSelector, useFormStore } from "@/store/useTask";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import CrossIcon from "@/components/CrossIcon";

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

const Tasks = () => {
  const { deleteTask } = useFormStore();
  const allTasks = useAllTasksSelector();

  const [data, setData] = useState<TFormData[]>([]);
  const [dataSearched, setDataSearched] = useState<TFormData[]>([]);
  const [dataFiltered, setDataFiltered] = useState<TFormData[]>([]);
  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    id: number | null;
    incidentId?: number;
  }>({ isOpen: false, id: null });

  const router = useRouter();

  const { control, setValue } = useForm<{ search: string; filter: string }>();

  const handleOnSearch = useCallback(
    debounce((searchValue: string) => {
      if (!searchValue && dataFiltered.length > 0) {
        setData(dataFiltered);
      } else if (!searchValue) {
        setData(allTasks);
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
        setData(dataSearched.length > 0 ? dataSearched : allTasks);
        setDataFiltered([]);
      } else {
        const filteredData = (
          dataSearched.length > 0 ? dataSearched : allTasks
        ).filter((item) => item.state === value);
        if (filteredData.length === 0) return;
        setData(filteredData);
        setDataFiltered(filteredData);
      }
    },
    [dataSearched, allTasks]
  );

  const handleOnDelete = useCallback(
    ({
      primaryTaskId,
      incidentId,
    }: {
      primaryTaskId: number | null;
      incidentId?: number;
    }) => {
      try {
        if (!primaryTaskId) {
          throw new Error("No se pudo eliminar la tarea");
        }
        if (incidentId) {
          deleteTask(primaryTaskId);
        } else {
          deleteTask(primaryTaskId);
        }
        setModalStatus({ isOpen: false, id: null });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [deleteTask]
  );

  useEffect(() => {
    setData(allTasks);
  }, [allTasks]);

  return (
    <div className={styles.container}>
      {modalStatus.isOpen && (
        <section className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <CrossIcon
                onClick={() =>
                  setModalStatus({
                    isOpen: false,
                    id: null,
                    incidentId: undefined,
                  })
                }
              />
            </div>

            {modalStatus.incidentId ? undefined : (
              <button
                type="button"
                className={styles.taskAction}
                onClick={() => router.push(`/tasks/incident/${modalStatus.id}`)}
              >
                Crear incidencia
              </button>
            )}

            <button
              type="button"
              className={styles.taskAction}
              onClick={() =>
                router.push(
                  `/tasks/${modalStatus.id}${modalStatus.incidentId ? `/${modalStatus.incidentId}` : ""}`
                )
              }
            >
              Editar tarea
            </button>
            <button
              type="button"
              className={styles.taskAction}
              onClick={() =>
                handleOnDelete({
                  primaryTaskId: modalStatus.id,
                  incidentId: modalStatus.incidentId,
                })
              }
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
                  rightIcon={
                    <CrossIcon
                      onClick={() => {
                        setValue("search", "");
                        handleOnSearch("");
                      }}
                    />
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
                    rightIcon={
                      <CrossIcon
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleOnFilter("");
                          setValue("filter", "");
                        }}
                      />
                    }
                  />
                </Dropdown>
              )}
            />
          </section>
        </section>

        <section className={styles.tasks}>
          {data.length === 0 ? (
            <p>No hay tareas disponibles.</p>
          ) : (
            data.map((task) => (
              <div key={task.id} className={styles.task}>
                <div className={styles.taskContent}>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                  {task.incidents ? (
                    <div className={styles.incidentsContainer}>
                      {task.incidents?.map((incident) => (
                        <div key={incident.id} className={styles.incident}>
                          <div>
                            <p>{incident.title}</p>
                            <p>{incident.description}</p>
                          </div>
                          <div>
                            <button
                              type="button"
                              className={styles.taskAction}
                              onClick={() => {
                                if (task.id)
                                  setModalStatus({
                                    isOpen: true,
                                    id: task.id,
                                    incidentId: incident.id,
                                  });
                              }}
                            >
                              Abrir
                            </button>

                            <p>Estado: {task.state}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : undefined}
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
};

export default Tasks;
