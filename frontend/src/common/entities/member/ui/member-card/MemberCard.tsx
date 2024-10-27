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

export const MemberCard: FC<any> = ({ member: work }) => {
  const user = useAtomValue(userAtom);

  const { event, id, member, result_sum, preview } = work;

  // const { data: resultData, isLoading } = useQuery(
  //   ["memberResult", id],
  //   () => getMemberResults(id),
  //   {
  //     enabled: !!id,
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
    if (!isMyMark()) {
      return `/member-evaluation/${id}`;
    }
    return `/member-result/${id}`;
  };

  const memberPoints = () => {
    if (!isMyMark()) {
      return "оцените работу";
    }
    if (result_sum) {
      return `${result_sum} ${declineNumberOfBalls(result_sum)}`;
    }
    return "оценивается";
  };

  return (
    <>
      {/* {!isLoading ? ( */}
      <>
        <li className={styles.members__item} key={member.id}>
          <Link
            href={memberLink()}
            className={cn(styles.members__content, {
              [styles.members__content_done]: member.is_done && isMyMark(),
            })}
          >
            <span className={styles.members__number}>№{member.id}</span>
            <div className={styles.members__service}>
              <p className={styles.members__nomination}>
                {`${member.nomination} ${member.category}`}
              </p>
              <span className={styles.members__points}>{memberPoints()}</span>
            </div>
            <div>
              <img
                width={55}
                height={55}
                className={styles.members__avatar}
                src={preview}
                alt={cn(member.nomination, member.category)}
              />
            </div>
          </Link>
        </li>
      </>
      {/* ) : (
        <Loader />
      )} */}
    </>
  );
};
