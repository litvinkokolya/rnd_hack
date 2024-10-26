import type { NextPage } from "next";
import styles from "./index.module.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Logo } from "common/shared/ui/logo";
import { Layout } from "common/shared/ui/layout";
import { LoginForm } from "common/features/login/ui/LoginForm";
import { useAtomValue } from "jotai";
import { userAtom } from "store";
import { useEffect } from "react";
import router from "next/router";

const Home: NextPage = () => {
  const queryClient = new QueryClient();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    user?.image && router.replace("/profile-edit");
  }, [user?.image]);

  return (
    <Layout pageTitle="Авторизация">
      <Logo />
      <h1 className={styles.auth_title}>Oggeto | Challenge Arena </h1>
      <h2 className={styles.auth_welcome}>Добрый день!</h2>
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    </Layout>
  );
};

export default Home;
