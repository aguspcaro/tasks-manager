/* eslint-disable indent */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";

import { useFormStore } from "@/store/formState";
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

function Tasks() {
  const { formData, updateTask } = useFormStore();
  const params = useParams();
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
        if (!data || !data.title || !data.description) {
          throw new Error(
            "Por favor, completa todos los campos del formulario"
          );
        }

        const idToUpdate = Number(params.id);
        if (Number.isNaN(idToUpdate)) {
          throw new Error("ID inválido");
        }

        updateTask({ ...data, id: idToUpdate });

        setTimeout(() => {
          setIsLoading(false);
          reset();
        }, 1000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [params.id, reset, updateTask]
  );

  const handleSelectOption = (options: OptionType) => {
    setSelectedOption(options);
    setValue("state", options.state);
  };

  useEffect(() => {
    if (formData) {
      const taskFound = formData.find((item) => item.id === Number(params.id));
      if (taskFound) {
        setValue("title", taskFound.title);
        setValue("description", taskFound.description);
        setValue("state", taskFound.state);
        setSelectedOption(
          taskFound.state === "pending"
            ? {
                id: 0,
                name: "Pendiente",
                state: "pending",
              }
            : {
                id: 1,
                name: "Completado",
                state: "completed",
              }
        );
      }
    }
  }, [formData, params, setValue]);

  const isDisabled = isSubmitting || !isValid || !isDirty;

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Editar tarea</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.taskContainer}
        >
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
            Enviar
          </button>
        </form>
      </FormProvider>
    </section>
  );
}

export default Tasks;
