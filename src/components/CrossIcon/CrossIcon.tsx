import React from "react";

import styles from "./CrossIcon.module.css";
import { CrossIconProps } from "./CrossIcon.types";

const CrossIcon = ({ onClick }: CrossIconProps) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick?.();
    }
  };
  return (
    <div
      role="button"
      className={styles.clearButton}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: "pointer" }}
      aria-label="Clear selection"
      data-testid="cross-icon"
    >
      <div className={styles.crossIconContainer}>
        <div
          className={`${styles.crossIconLine} ${styles.crossIconLineDiagonal1}`}
        />
        <div
          className={`${styles.crossIconLine} ${styles.crossIconLineDiagonal2}`}
        />
      </div>
    </div>
  );
};

export default CrossIcon;
