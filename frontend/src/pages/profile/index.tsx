import { useAtomValue } from "jotai";
import { champAtom, userAtom } from "store";
import Avatar from "common/shared/ui/avatar/Avatar";
import { UserName } from "common/shared/ui/user-name";
import { UserRole } from "common/shared/ui/user-role";
import { UserAction } from "common/shared/ui/user-action";
import { Layout } from "common/shared/ui/layout";
import Link from "next/link";
import { Loader } from "common/shared/ui/loader";
import { useEffect, useState } from "react";
import { MembersList } from "common/widgets/members-list/";
import { Button } from "common/shared/ui/button";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { IMember } from "common/entities/member";
import { getWorks } from "common/shared/api/works";

function ProfilePage() {
  const champ = useAtomValue(champAtom);
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [works, setWorks] = useState<any[]>();

  const { isLoading: isMembersLoading } = useQuery(
    "worksList",
    async () => {
      const { data } = await getWorks(champ?.id!);
      setWorks(data);
      return data;
    },
    {
      enabled: !!champ?.id,
      refetchOnWindowFocus: true,
      refetchInterval: 50 * 60 * 100,
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout fullHeight pageTitle="Профиль">
      {user && isClient ? (
        <>
          <Link href="/profile-edit">
            <Avatar edit user={user} />
          </Link>
          <UserName />
          <UserRole />
          <UserAction role={champ?.role!} />
          {works?.some((work) => work.is_filled_mine) ? null : (
            <Button
              onClick={() => {
                router.push("/upload-photo");
              }}
            >
              Выложить свой результат
            </Button>
          )}

          <MembersList works={works} isLoading={isMembersLoading} />
        </>
      ) : (
        <Loader fullPage />
      )}
    </Layout>
  );
}

export default ProfilePage;
