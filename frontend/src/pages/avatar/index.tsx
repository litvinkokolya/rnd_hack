import { useEffect, useState } from "react";
import styles from "./avatar.module.scss";
import AvatarForm from "common/features/select-avatar/ui/AvatarForm/AvatarForm";
import CheckMark from "common/shared/ui/checkmark-animation/CheckMark";
import { QueryClient, QueryClientProvider } from "react-query";
import { Logo } from "common/shared/ui/logo";
import { Layout } from "common/shared/ui/layout";

export default function AvatarPage() {
  const queryClient = new QueryClient();
  const [showCheckMark, setShowCheckMark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowCheckMark(true);
    }
  }, []);

  return (
    <>
      {showCheckMark && <CheckMark text="Успешно!" />}
      <Layout pageTitle="Выбор Аватара">
        <Logo />
        <h1 className={styles.auth_title}>Красота!</h1>
        <QueryClientProvider client={queryClient}>
          <AvatarForm />
        </QueryClientProvider>
      </Layout>
    </>
  );
}
