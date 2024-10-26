import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MemberCard.module.scss";
import unknownAvatar from "@public/images/unknown-avatar.svg";
import { declineNumberOfBalls } from "common/shared/helpers";
import { MemberCardProps } from "common/entities/member/lib";
import { useAtomValue } from "jotai";
import { userAtom } from "store";
import { getMemberResults } from "common/shared/api/assessments";
import { useQuery } from "react-query";
import { Loader } from "common/shared/ui/loader";
import { getUserIsStaff } from "common/shared/constants";
import cn from "classnames";

export const MemberCard: FC<MemberCardProps> = ({ member: work }) => {
  const user = useAtomValue(userAtom);

  const { preview, id, result_sum, member, is_done } = work;

  // const { data: resultData, isLoading } = useQuery(
  //   ['memberResult', id],
  //   () => getMemberResults(id),
  //   {
  //     enabled: !!id && USER_IS_STAFF,
  //   }
  // );

  const isMyMark = () => {
    // if (USER_IS_STAFF) {
    //   return resultData?.data
    //     .map((result: any) => result.event_staff)
    //     .includes(user?.id);
    // }
    return true;
  };

  const memberLink = () => {
    if (preview && !isMyMark()) {
      return `/member-evaluation/${id}`;
    }
    return `/member-result/${id}`;
  };

  const memberPoints = () => {
    if (!isMyMark()) {
      return "оцените работу";
    }
    if (preview && result_sum) {
      return `${result_sum} ${declineNumberOfBalls(result_sum)}`;
    }
    return "оценивается";
  };

  const notPhotoMembers = () => !preview;

  return (
    <>
      {/* {!isLoading ? ( */}
      <>
        {!notPhotoMembers() && (
          <li className={styles.members__item} key={id}>
            <Link
              href={memberLink()}
              className={cn(styles.members__content, {
                [styles.members__content_done]: is_done && isMyMark(),
              })}
            >
              <span className={styles.members__number}>№{id}</span>
              <div className={styles.members__service}>
                <span className={styles.members__points}>{memberPoints()}</span>
              </div>
              <div>
                {preview ? (
                  <>
                    <img
                      width={55}
                      height={55}
                      className={styles.members__avatar}
                      src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${preview}`}
                    />
                  </>
                ) : (
                  <>
                    <Image
                      width={55}
                      height={55}
                      src={unknownAvatar}
                      alt="Фото не выбрано"
                    ></Image>
                  </>
                )}
              </div>
            </Link>
          </li>
        )}
      </>
      {/* ) : (
        <Loader />
      )} */}
    </>
  );
};
