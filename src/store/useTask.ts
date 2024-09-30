/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TIncident = {
  id?: number;
  primaryTaskId: number;
  title: string;
  description: string;
  state: "pending" | "completed";
};

export type TFormData = {
  id: number;
  title: string;
  description: string;
  state: "pending" | "completed";
  incidents?: TIncident[];
};

type TFormStore = {
  formData: TFormData[];
  setFormData: (data: TFormData) => void;
  updateTask: (updatedTask: TFormData) => void;
  deleteTask: (id: number) => void;
  setSubTask: ({
    primaryTaskId,
    subTask,
  }: {
    primaryTaskId: number;
    subTask: TIncident;
  }) => void;
  history: {
    primaryTaskId: number;
    incidentId?: number;
    action: "add" | "edit" | "delete" | "add-incident";
    timestamp: string;
  }[];
  setHistory: ({
    primaryTaskId,
    incidentId,
    action,
  }: {
    primaryTaskId: number;
    incidentId?: number;
    action: "add" | "edit" | "delete" | "add-incident";
  }) => void;
};

export const useFormStore = create(
  persist<TFormStore>(
    (set) => ({
      formData: [],
      history: [],
      setHistory: ({ primaryTaskId, incidentId, action }) =>
        set((state) => {
          const updateTimestamp = new Date().toISOString();
          const newSethistory = {
            primaryTaskId,
            incidentId,
            action,
            timestamp: updateTimestamp,
          };
          const history = [...state.history, newSethistory];

          return { history };
        }),
      setFormData: (data) =>
        set((state) => {
          const id = state.formData.length + 1;
          state.setHistory({ primaryTaskId: id, action: "add" });
          return {
            formData: [
              ...state.formData,
              ...[data].map((item) => ({
                ...item,
                id,
              })),
            ],
          };
        }),

      updateTask: (updatedTask) =>
        set((state) => {
          const index = state.formData.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (index !== -1) {
            const updatedTasks = [...state.formData];
            updatedTasks[index] = updatedTask;
            state.setHistory({
              primaryTaskId: updatedTasks[index].id,
              action: "edit",
            });

            return { formData: updatedTasks };
          }
          return { formData: state.formData };
        }),

      deleteTask: (id: number) =>
        set((state) => {
          const updatedTasksAfterDelete = state.formData.filter(
            (task) => task.id !== id
          );
          state.setHistory({ primaryTaskId: id, action: "delete" });

          return { formData: updatedTasksAfterDelete };
        }),

      setSubTask: ({ primaryTaskId, subTask }) =>
        set((state) => {
          const updatedTasks = state.formData.map((task) => {
            if (task.id === primaryTaskId) {
              const incidentId = task.incidents ? task.incidents.length + 1 : 1;
              state.setHistory({
                primaryTaskId: incidentId,
                incidentId,
                action: "add-incident",
              });
              return {
                ...task,
                incidents: task.incidents
                  ? [...task.incidents, { ...subTask, id: incidentId }]
                  : [{ ...subTask, id: incidentId }],
              };
            }
            return task;
          });

          return { formData: updatedTasks };
        }),
    }),
    {
      name: "form-storage",
      storage: createJSONStorage<TFormStore>(() => localStorage),
    }
  )
);

export const useTaskSelector = (id: number) =>
  useFormStore((state) => state.formData.find((task) => task.id === id));

export const useHistorySelector = () => useFormStore((state) => state.history);
export const useAllTasksSelector = () =>
  useFormStore((state) => state.formData);
