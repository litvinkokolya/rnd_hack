import {
  IMember,
  MemberCard,
  MemberCardSkeleton,
} from "common/entities/member";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useQuery } from "react-query";
import { champAtom } from "store";
import styles from "./MembersList.module.scss";
import { EvaluationModal } from "common/features/evaluation-member/ui";
import { motion } from "framer-motion";
import { getWorks } from "common/shared/api/works";

export const MembersList = ({ isMembersLoading, works }: any) => {
  // const [works, setWorks] = useState<IMember[]>();
  const champ = useAtomValue(champAtom);

  // const { isLoading: isMembersLoading } = useQuery(
  //   "worksList",
  //   async () => {
  //     const { data } = await getWorks(champ?.id!);
  //     setWorks(data);
  //     return data;
  //   },
  //   {
  //     enabled: !!champ?.id,
  //     refetchOnWindowFocus: true,
  //     refetchInterval: 50 * 60 * 100,
  //   }
  // );

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
    <ul className={styles.members__list}>
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
      {renderMemberCards(works!)}
      <EvaluationModal />
    </>
  );
};
