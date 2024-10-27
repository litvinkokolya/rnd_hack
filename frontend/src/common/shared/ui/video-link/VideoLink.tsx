import { IMember } from "common/entities/member";
import Link from "next/link";
import styles from "./VideoLink.module.scss";

export const VideoLink = ({ workVideo }: { workVideo: string }) => {
  return (
    <>
      {workVideo ? (
        <Link
          target="_blank"
          href={workVideo}
          className={styles.result__video_link}
        >
          Посмотреть Видео Работы
        </Link>
      ) : null}
    </>
  );
};
