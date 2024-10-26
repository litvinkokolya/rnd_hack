import { ChangeEvent, ForwardRefRenderFunction, Ref } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps {
  placeholder?: string;
  value?: string;
  error?: string | boolean;
  icon?: string;
  maxLength?: number;
  minLength?: number;
  ref?: Ref<HTMLTextAreaElement>;
  required?: boolean;
  onChange?: any;
  onInput?: any;
  autofocus?: boolean;
  autoComplete?: string;
}

function checkInputLength(event: ChangeEvent<HTMLTextAreaElement>) {
  const input = event.target;
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength);
  }
}

export const Textarea: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({
  placeholder,
  maxLength,
  minLength,
  value,
  onChange,
  onInput = checkInputLength,
  error,
  icon = "",
  autofocus,
  required = false,
  ref,
  autoComplete = "off",
}) => {
  return (
    <div
      className={`${styles.input_box} ${styles[icon]} ${
        error && styles[icon + "_error"]
      }`}
    >
      <textarea
        autoFocus={autofocus}
        className={`${styles.UI_input} ${error ? styles.UI_input_error : ""}`}
        placeholder={placeholder}
        value={value}
        required={required}
        ref={ref}
        maxLength={maxLength}
        minLength={minLength}
        onInput={onInput}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </div>
  );
};
