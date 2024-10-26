import Image from "next/image";
import logo from "@public/images/oggeto.png";
import styles from "./Logo.module.scss";

export const Logo = () => {
  return (
    <Image
      src={logo}
      className={styles.logo}
      alt="Логотип Oggeto"
      width={240}
      height={150}
    />
  );
};
