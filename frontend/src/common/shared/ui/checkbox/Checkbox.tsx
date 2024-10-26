import styles from "./Checkbox.module.scss";

export const Checkbox = ({
  onChange,
  checked,
  value,
}: {
  onChange: () => void;
  checked: boolean;
  value?: string;
}) => {
  return (
    <>
      {value && <label htmlFor="checkbox">{value}</label>}
      <input
        type="checkbox"
        checked={checked}
        className={styles.UI_checkbox}
        onChange={onChange}
        value={value}
        id="checkbox"
      />
    </>
  );
};
