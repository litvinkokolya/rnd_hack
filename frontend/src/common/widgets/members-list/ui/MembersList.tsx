import {
  IMember,
  MemberCard,
  MemberCardSkeleton,
} from "common/entities/member";
import { getMembers } from "common/shared/api/members";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { champAtom, userAtom } from "store";
import styles from "./MembersList.module.scss";
import { EvaluationModal } from "common/features/evaluation-member/ui";
import { getUserIsOrganizer, getUserIsStaff } from "common/shared/constants";
import { motion } from "framer-motion";
import { Loader } from "common/shared/ui/loader";

export const MembersList = () => {
  const [members, setMembers] = useState<IMember[]>();
  const champ = useAtomValue(champAtom);
  const USER_IS_STAFF = getUserIsStaff();
  const USER_IS_ORGANIZER = getUserIsOrganizer();
  const user = useAtomValue(userAtom);

  const { isLoading: isMembersLoading } = useQuery(
    "membersList",
    async () => {
      const { data } = await getMembers(champ?.id!);
      setMembers(data);
      return data;
    },
    {
      enabled: !!champ?.id,
      refetchOnWindowFocus: true,
      refetchInterval: 50 * 60 * 100,
    }
  );

  const currentMasterMembers = useMemo(() => {
    return (
      members?.filter((member) => member.member.includes(user?.last_name!)) ||
      []
    );
  }, [members, user?.last_name]);

  const otherMasterMembers = useMemo(() => {
    return (
      members?.filter((member) => !member.member.includes(user?.last_name!)) ||
      []
    );
  }, [members, user?.last_name]);

  if (isMembersLoading) {
    return (
      <ul className={styles.members__list} style={{ paddingTop: "20px" }}>
        {Array.from({ length: 5 }, (_, index) => (
          <MemberCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  const renderMemberCards = (members: IMember[]) => (
    <ul
      className={styles.members__list}
      style={{
        minHeight: `${
          members === currentMasterMembers && members.length * 75
        }px`,
      }}
    >
      {members?.map((member, index) => (
        <motion.li
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <MemberCard key={member.id} member={member} />
        </motion.li>
      ))}
    </ul>
  );

  return (
    <>
      {USER_IS_STAFF ? (
        renderMemberCards(members!)
      ) : (
        <>
          {!USER_IS_ORGANIZER && currentMasterMembers.length !== 0 && (
            <>
              <h3 className={styles.members__title}>Ваши работы:</h3>
              {renderMemberCards(currentMasterMembers)}
            </>
          )}
          {!USER_IS_ORGANIZER && (
            <h3 className={styles.members__title}>Работы других мастеров:</h3>
          )}
          {otherMasterMembers.length !== 0 ? (
            renderMemberCards(otherMasterMembers)
          ) : (
            <Loader fullPage />
          )}
        </>
      )}
      <EvaluationModal />
    </>
  );
};
