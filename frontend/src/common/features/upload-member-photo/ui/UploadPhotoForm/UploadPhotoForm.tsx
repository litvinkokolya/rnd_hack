import { Button } from "common/shared/ui/button";
import { useState } from "react";
import styles from "./UploadPhotoForm.module.scss";
import { useRouter } from "next/router";
import UploadPhotoBox from "../UploadPhotoBox/UploadPhotoBox";
import {
  useUploadPhotos,
  useMemberImageSrc,
  useFileChange,
} from "common/features/upload-member-photo/model";
import Link from "next/link";
import { BEAUTY_RANK_BOT } from "common/shared/api/endpoints";
import { champAtom } from "store";
import { useAtomValue } from "jotai";

const UploadPhotoForm = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);
  const champ = useAtomValue(champAtom);

  const [selectedFiles, setSelectedFiles] = useState<any[]>(
    Array.from({ length: Number(champ?.count_photo) ?? 0 }, () => ({
      photo: null,
    }))
  );
  console.log(selectedFiles);

  const { handleFileChange } = useFileChange({
    setSelectedFiles,
  });
  const { getImageSrc } = useMemberImageSrc({ selectedFiles });
  const { mutation, isLoading } = useUploadPhotos({ selectedFiles });

  const buttonIsDisabled = () => {
    if (selectedFiles.length) {
      return selectedFiles.some(
        (file) => file?.photo === undefined || file?.photo === null
      );
    }
    return true;
  };

  return (
    <>
      <div className={styles.upload_photo__decor}></div>
      <h3 className={styles.upload_photo__title}>Загрузите фото результата</h3>
      <form className={styles.upload_photo__form}>
        <UploadPhotoBox
          title=""
          photos={champ?.count_photo ?? ""}
          onChange={handleFileChange}
          getImageSrc={getImageSrc}
        />
      </form>
      <Link
        target="_blank"
        href={`${BEAUTY_RANK_BOT}${memberId}`}
        className={styles.upload_photo__video_link}
      >
        Загрузить Видео
      </Link>
      <Button
        disabled={buttonIsDisabled() || isLoading}
        className={styles.upload_photo__btn}
        onClick={() => mutation.mutate()}
      >
        {isLoading ? "Загрузка..." : "Подтвердить"}
      </Button>
    </>
  );
};

export default UploadPhotoForm;
