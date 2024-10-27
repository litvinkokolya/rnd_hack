import { FC } from "react";
import Link from "next/link";
import styles from "./MemberCard.module.scss";
import { declineNumberOfBalls } from "common/shared/helpers";
import cn from "classnames";

export const MemberCard: FC<any> = ({ member: work }) => {
  const { preview, id, result_sum, is_filled_mine, is_done, is_my_mark } = work;

  const memberLink = () => {
    if (is_filled_mine) {
      return `/member-result/${id}`;
    }
    if (preview && !is_my_mark) {
      return `/member-evaluation/${id}`;
    }
    return `/member-result/${id}`;
  };

  const memberPoints = () => {
    if (!is_my_mark && !is_filled_mine) {
      return "оцените работу";
    }
    if (result_sum) {
      return `${result_sum} ${declineNumberOfBalls(result_sum)}`;
    }
    return "оценивается";
  };

  const notPhotoMembers = () => !preview;

  return (
    <>
      {!notPhotoMembers() && (
        <li className={styles.members__item} key={id}>
          <Link
            href={memberLink()}
            className={cn(styles.members__content, {
              [styles.members__content_other]: is_filled_mine,
              [styles.members__content_done]: is_done && is_my_mark,
            })}
          >
            <span className={styles.members__number}>№{id}</span>
            <div className={styles.members__service}>
              <span className={styles.members__points}>{memberPoints()}</span>
            </div>
            <div>
              <div>
                <img
                  width={55}
                  height={55}
                  className={styles.members__avatar}
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${preview}`}
                />
              </div>
            </div>
          </Link>
        </li>
      )}
    </>
  );
};
