import { Layout } from "common/shared/ui/layout";
import { ProfileEditForm } from "common/features/profile-edit/ui/ProfileEditForm";
import { useEffect } from "react";

function ProfilePageEdit() {
  return (
    <Layout pageTitle="Редактирование Профиля">
      <ProfileEditForm />
    </Layout>
  );
}

export default ProfilePageEdit;
