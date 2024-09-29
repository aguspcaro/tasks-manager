/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TFormData = {
  id?: number;
  title: string;
  description: string;
  state: "pending" | "completed";
};

type TFormStore = {
  formData: TFormData[];
  setFormData: (data: TFormData) => void;
  updateTask: (updatedTask: TFormData) => void;
  deleteTask: (id: number) => void;
};

export const useFormStore = create(
  persist<TFormStore>(
    (set) => ({
      formData: [],
      setFormData: (data) =>
        set((state) => ({
          formData: [
            ...state.formData,
            ...[data].map((item) => ({
              ...item,
              id: state.formData.length + 1,
            })),
          ],
        })),

      updateTask: (updatedTask: TFormData) =>
        set((state) => {
          const updatedTasks = state.formData.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          return { formData: updatedTasks };
        }),

      deleteTask: (id: number) =>
        set((state) => {
          const updatedTasks = state.formData.filter((task) => task.id !== id);
          return { formData: updatedTasks };
        }),
    }),
    {
      name: "form-storage",
      storage: createJSONStorage<TFormStore>(() => localStorage),
    }
  )
);
