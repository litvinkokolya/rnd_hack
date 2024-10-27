import styles from "./MemberPhotosList.module.scss";
import { IPhoto } from "common/features/upload-member-photo/lib";
import { MemberPhotosListContent } from "../member-photos-list-content/MemberPhotosListContent";

export const MemberPhotosList = ({
  memberPhotos,
}: {
  memberPhotos: IPhoto[] | undefined;
}) => {
  return (
    <>
      {memberPhotos && (
        <div className={styles.member_photos__box}>
          <MemberPhotosListContent photos={memberPhotos} />
        </div>
      )}
    </>
  );
};
