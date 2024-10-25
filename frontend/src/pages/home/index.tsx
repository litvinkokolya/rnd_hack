import clsx from "clsx";
import styles from "./home.module.scss";
import { LoginForm, RegisterForm } from "../../components";
import { useState } from "react";

export function Home() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className={clsx(styles.home, "container")}>
      <h1 className={styles.title}>Oggeto | Challenge Arena</h1>
      <h2 className={styles.subtitle}>
        Корпоративная соревновательная платформа
      </h2>
      <h3 className={styles.welcome}>Добро пожаловать!</h3>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      {isLogin ? (
        <p>
          Не зарегистрированы? -{" "}
          <button className={styles.link} onClick={() => setIsLogin(false)}>
            Зарегистрироваться
          </button>
        </p>
      ) : (
        <p>
          Уже зарегистрированы? -{" "}
          <button className={styles.link} onClick={() => setIsLogin(true)}>
            Авторизация
          </button>
        </p>
      )}
    </div>
  );
}
