/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from "./Dropdown";

describe("Componente Dropdown", () => {
  const mockList = [
    { id: 1, name: "Opción 1" },
    { id: 2, name: "Opción 2" },
  ];

  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear(); // Asegurarse de limpiar el mock antes de cada test
  });

  test("llama a onSelect con el valor correcto cuando se selecciona una opción", () => {
    render(
      <Dropdown
        list={mockList}
        onSelect={onSelect}
        renderLabel={(item) => item.name}
        renderKey={(item) => item.id}
      >
        <span>Seleccionar opción</span>
      </Dropdown>
    );

    // Abrir el dropdown
    const button = screen.getByRole("button", { name: /Seleccionar opción/i });
    fireEvent.click(button);

    // Seleccionar la primera opción
    const optionButton = screen
      .getByTestId("dropdown-item-1")
      .querySelector("button");
    fireEvent.click(optionButton!);

    // Verificar si `onSelect` fue llamado con el valor correcto
    expect(onSelect).toHaveBeenCalledWith(mockList[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test("cierra el dropdown después de seleccionar una opción", () => {
    render(
      <Dropdown
        list={mockList}
        onSelect={onSelect}
        renderLabel={(item) => item.name}
        renderKey={(item) => item.id}
      >
        <span>Seleccionar opción</span>
      </Dropdown>
    );

    // Abrir el dropdown
    const button = screen.getByRole("button", { name: /Seleccionar opción/i });
    fireEvent.click(button);

    // Seleccionar la primera opción
    const optionButton = screen
      .getByTestId("dropdown-item-1")
      .querySelector("button");
    fireEvent.click(optionButton!);

    // Verifica que el dropdown se haya cerrado
    expect(screen.queryByTestId("dropdown-list")).not.toBeInTheDocument();
  });

  test("no muestra opciones cuando la lista está vacía", () => {
    render(
      <Dropdown
        list={[]}
        onSelect={onSelect}
        renderLabel={(item) => item.name}
        renderKey={(item) => item.id}
      >
        <span>Seleccionar opción</span>
      </Dropdown>
    );

    // Abrir el dropdown
    const button = screen.getByRole("button", { name: /Seleccionar opción/i });
    fireEvent.click(button);

    // Verifica que no se muestre la lista del dropdown
  });
});
