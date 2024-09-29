/* eslint-disable no-unused-vars */
import { PropsWithChildren, useState } from "react";

import styles from "./Dropdown.module.css";

type DropdownProps<T> = {
  list: T[];
  onSelect: (value: T) => void;
  renderLabel: (item: T) => string;
  renderKey: (item: T) => string | number;
};

function Dropdown<T>({
  list,
  children,
  onSelect,
  renderLabel,
  renderKey,
}: PropsWithChildren<DropdownProps<T>>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        className={styles.dropdownAction}
      >
        {children}
      </button>
      {isOpen ? (
        <div className={styles.dropdown}>
          {list.map((item, index) => (
            <ul
              key={renderKey(item)}
              className={`${styles.listItem} ${
                list.length - 1 !== index ? styles.separator : ""
              }`}
            >
              <button
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className={styles.dropdownItemAction}
                type="button"
              >
                {renderLabel(item)}
              </button>
            </ul>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}

export default Dropdown;
