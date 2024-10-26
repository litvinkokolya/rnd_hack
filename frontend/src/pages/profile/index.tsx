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

function ProfilePage() {
  const champ = useAtomValue(champAtom);
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);

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
          <MembersList />
        </>
      ) : (
        <Loader fullPage />
      )}
    </Layout>
  );
}

export default ProfilePage;
