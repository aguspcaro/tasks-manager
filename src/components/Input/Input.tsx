import React, { forwardRef } from "react";
import styles from "./Input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorText, leftIcon, ...rest }, ref) => (
    <div className={styles.inputContainer}>
      {label ? (
        <label className={styles.label} htmlFor={rest.name}>
          {label}
        </label>
      ) : undefined}
      <input
        ref={ref}
        className={styles.input}
        aria-autocomplete="none"
        autoComplete="off"
        autoCorrect="off"
        {...rest}
      />
      {leftIcon ? (
        <div className={styles.leftIconContainer}>{leftIcon}</div>
      ) : undefined}
      {errorText ? (
        <span className={styles.errorMessage}>{errorText}</span>
      ) : null}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
