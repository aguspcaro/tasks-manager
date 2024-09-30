"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "next/navigation";

import { TFormData, useFormStore, useTaskSelector } from "@/store/useTask";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";

import styles from "./page.module.css";

type FormValues = {
  title: string;
  description: string;
  state: "pending" | "completed";
};

type OptionType = {
  id: number;
  name: string;
  state: "pending" | "completed";
};

function Incident() {
  const { setSubTask } = useFormStore();
  const params = useParams();

  const taskById = useTaskSelector(Number(params.id));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | undefined>(
    undefined
  );

  const [task, setTask] = useState<TFormData | null>(null);

  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      state: "pending",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = methods;

  const onSubmit = useCallback(
    (data: FormValues) => {
      setIsLoading(true);
      try {
        if (!data) throw new Error("Formulario no válido");
        setSubTask({
          primaryTaskId: Number(params.id),
          subTask: { ...data, primaryTaskId: Number(params.id) },
        });
        setTimeout(() => {
          setIsLoading(false);
          reset();
        }, 2000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [params.id, reset, setSubTask]
  );

  const handleSelectOption = (options: OptionType) => {
    setSelectedOption(options);
    setValue("state", options.state);
  };

  useEffect(() => {
    if (!taskById) return;
    setTask(taskById);
  }, [taskById]);

  const isDisabled = isSubmitting || !isValid || !isDirty;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Formulario de incidencias</h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.taskTitleContainer}>
              <h3 className={styles.taskTitle}>Título:</h3>
              <p className={styles.taskTitleContent}>{task?.title}</p>
            </div>

            <Input
              {...register("title", {
                required: "Este campo es obligatorio",
              })}
              label="Título"
              placeholder="Escribe el título"
              errorText={errors.title?.message as string}
            />

            <Input
              {...register("description", {
                required: "Este campo es obligatorio",
              })}
              label="Descripción"
              placeholder="Escribe la descripción"
              errorText={errors.description?.message as string}
            />

            <Dropdown
              list={[
                { id: 1, name: "Pendiente", state: "pending" },
                { id: 2, name: "Completado", state: "completed" },
              ]}
              onSelect={handleSelectOption}
              renderLabel={(item) => item.name}
              renderKey={(item) => item.id}
            >
              <Input
                {...register("state")}
                label="Estado"
                placeholder="Selecciona el estado"
                value={selectedOption?.name || "Pendiente"}
              />
            </Dropdown>

            <button
              type="submit"
              className={`${styles.submitButton} ${isDisabled || isLoading ? styles.disabled : ""}`}
              disabled={isDisabled || isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}

export default Incident;
