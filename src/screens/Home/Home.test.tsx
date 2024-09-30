/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";

describe("Home Component", () => {
  //   test("permite al usuario llenar el formulario y enviarlo", async () => {
  //     render(<Home />);

  //     // Completa el formulario
  //     fireEvent.change(screen.getByLabelText(/título/i), {
  //       target: { value: "Nueva tarea" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/descripción/i), {
  //       target: { value: "Descripción de la tarea" },
  //     });

  //     // Selecciona una opción del dropdown
  //     fireEvent.click(screen.getByLabelText(/estado/i)); // Abre el dropdown
  //     fireEvent.click(screen.getByText(/completado/i)); // Selecciona "Completado"

  //     // Envía el formulario
  //     fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

  //     // Verifica que el botón muestra "Enviando..."
  //     expect(await screen.findByText(/enviando/i)).toBeInTheDocument();
  //   });

  test("permite seleccionar una opción del dropdown", async () => {
    render(<Home />);

    // Verifica que el valor inicial sea "Pendiente"
    const estadoInput = screen.getByLabelText(/estado/i);
    expect(estadoInput).toHaveValue("pending");

    // Selecciona una nueva opción
    fireEvent.click(screen.getByLabelText(/estado/i)); // Abre el dropdown
    fireEvent.click(screen.getByText(/completado/i)); // Selecciona "Completado"

    // Verifica que el valor cambió a "Completado"
    expect(estadoInput).toHaveValue("Completado");
  });

  //   test("envía el formulario correctamente y restablece el formulario", async () => {
  //     render(<Home />);

  //     // Completa el formulario
  //     fireEvent.change(screen.getByLabelText(/título/i), {
  //       target: { value: "Nueva tarea" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/descripción/i), {
  //       target: { value: "Descripción de la tarea" },
  //     });
  //     fireEvent.click(screen.getByLabelText(/estado/i)); // Abre el dropdown
  //     fireEvent.click(screen.getByText(/completado/i)); // Selecciona "Completado"

  //     // Envía el formulario
  //     fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

  //     // Verifica que el botón muestra "Enviando..."
  //     expect(await screen.findByText(/enviando/i)).toBeInTheDocument();

  //     // Verifica que el formulario se restablece
  //     await waitFor(() => {
  //       expect(screen.getByLabelText(/título/i)).toHaveValue("");
  //       expect(screen.getByLabelText(/descripción/i)).toHaveValue("");
  //       expect(screen.getByLabelText(/estado/i)).toHaveValue("Pendiente");
  //     });
  //   });
});
