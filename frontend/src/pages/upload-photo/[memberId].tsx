import { useEffect } from "react";
import { Layout } from "common/shared/ui/layout";
import { GoBackButton } from "common/shared/ui/go-back-btn";
import UploadPhotoForm from "common/features/upload-member-photo/ui/UploadPhotoForm/UploadPhotoForm";

const UploadPhotoPage = () => {
  return (
    <Layout pageTitle="Загрузите Фото">
      <GoBackButton />
      <UploadPhotoForm />
    </Layout>
  );
};

export default UploadPhotoPage;
