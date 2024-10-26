import { FC, useEffect } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox } from "@fancyapps/ui";
import styles from "./MemberPhotosListContent.module.scss";
import { IMemberPhotoList } from "common/features/evaluation-member/lib";

export const MemberPhotosListContent: FC<IMemberPhotoList> = ({ photos }) => {
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false,
      Images: {
        zoom: false,
      },
    });
  }, []);

  return (
    <ul className={styles.member_photos__list}>
      {photos.map((photo) => (
        <li key={photo.id} className={styles.member_photos__item}>
          <a
            data-fancybox
            data-src={photo.image}
            href={photo.image as string}
            className={styles.member_photos__link}
          >
            <img
              className={styles.member_photos__img}
              src={photo.image}
              width={100}
              height={100}
            />
          </a>
          <span className={styles.member_photos__name}>{photo.name}</span>
        </li>
      ))}
    </ul>
  );
};
