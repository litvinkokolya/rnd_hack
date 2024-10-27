import { getMemberPhotos } from "common/shared/api/members";
import { useState, useCallback, ChangeEvent } from "react";
import { useQuery } from "react-query";
import { champAtom, userAtom } from "store";
import { useAtomValue } from "jotai";

export const useMember = (memberId: number) => {
  const champ = useAtomValue(champAtom);
  const user = useAtomValue(userAtom);
  const criteriesStore = champ?.criteries.map((critery) => {
    return {
      name: critery,
      score: 0,
    };
  });
  const [criteries, setCriteries] = useState<any>(criteriesStore);

  const [totalScore, setTotalScore] = useState(0);

  const { data: memberPhotosData, isLoading: isPhotosLoading } = useQuery(
    "memberPhotos",
    () => getMemberPhotos(memberId),
    {
      enabled: !!memberId,
    }
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, attribute: any) => {
      const newScore = Number(e.target.value);
      const oldScore = attribute.score || 0;

      setTotalScore(totalScore + newScore - oldScore);
      setCriteries((prevMemberAttributes: any) =>
        prevMemberAttributes.map((attr: any) =>
          attr.name === attribute.name ? { ...attr, score: newScore } : attr
        )
      );
    },
    [totalScore]
  );

  return {
    memberPhotos: memberPhotosData?.data,
    memberAttributes: criteries,
    totalScore,
    isLoading: isPhotosLoading,
    handleChange,
  };
};
