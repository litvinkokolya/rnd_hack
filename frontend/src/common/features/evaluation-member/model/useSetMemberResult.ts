import { useMutation } from "react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "store";
import { IResult, SetMemberResultProps } from "../lib";
import { setMemberResults } from "common/shared/api/assessments";
import { useRouter } from "next/router";

export const useSetMemberResult = ({
  totalScore,
  memberAttributes,
}: SetMemberResultProps) => {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { memberId: id } = router.query;
  return useMutation(["memberResult"], async () => {
    try {
      const result: Partial<IResult> = {
        balls: totalScore,
        work: id as unknown as number,
        reviewer: user?.memberId,
        score_retail: {},
      };

      memberAttributes.forEach((attribute) => {
        if (attribute.score !== undefined) {
          result.score_retail![attribute.name] = attribute.score.toString();
        }
      });
      //@ts-ignore
      setMemberResults({ ...result, score: result.score_retail });
      router.push({
        pathname: "/profile",
        query: { evaluation: id, score: totalScore },
      });
    } catch (e) {
      console.error(e);
    }
  });
};
