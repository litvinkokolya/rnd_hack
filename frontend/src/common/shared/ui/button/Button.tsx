import { FC, useEffect, useState } from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

export const Button: FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  loading,
  className = "",
  type = "button",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <button
          type={type}
          className={cn(styles.UI_button, className, {
            [styles.UI_button_disabled]: disabled,
            [styles.UI_button_loading]: loading,
          })}
          disabled={disabled || loading}
          onClick={onClick}
        >
          {loading ? "Загрузка..." : <>{children}</>}
        </button>
      )}
    </>
  );
};
