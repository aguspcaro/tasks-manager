"use client";

import React, { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { useFormStore } from "@/store/useTask";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";

import styles from "./Home.module.css";

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

function Home() {
  const { setFormData } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | undefined>(
    undefined
  );

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
        setFormData(data);
        setTimeout(() => {
          setIsLoading(false);
          reset();
        }, 2000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [reset, setFormData]
  );

  const handleSelectOption = (options: OptionType) => {
    setSelectedOption(options);
    setValue("state", options.state);
  };

  const isDisabled = isSubmitting || !isValid || !isDirty;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Formulario de tareas</h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                readOnly
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

export default Home;
