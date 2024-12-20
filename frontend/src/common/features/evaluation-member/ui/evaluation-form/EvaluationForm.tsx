import { useMemo } from "react";
import styles from "./EvaluationForm.module.scss";
import { Button } from "common/shared/ui/button";
import { Loader } from "common/shared/ui/loader";
import { IEvaluationFormProps } from "../../lib";
import EvaluationCriteriaForm from "../evaluation-criteria-form/EvaluationCriteriaForm";
import { useMember, useSetMemberResult } from "../../model";
import { MemberPhotosList } from "common/widgets/member-photos-list";
import { VideoLink } from "common/shared/ui/video-link";
import { useRouter } from "next/router";

export const EvaluationForm = ({ memberId }: IEvaluationFormProps) => {
  const {
    memberPhotos,
    memberAttributes,
    totalScore,
    isLoading,
    handleChange,
  } = useMember(memberId);
  const router = useRouter();
  const { memberId: id } = router.query;

  const isAllAttributesFilled = useMemo(() => {
    return memberAttributes.every((attribute: any) => attribute.score !== 0);
  }, [memberAttributes]);

  const { mutateAsync: postResult, isLoading: isResultLoading } =
    useSetMemberResult({
      totalScore,
      memberAttributes,
    });

  if (isLoading) {
    return <Loader fullPage />;
  }

  const workVileo = memberPhotos?.find((item) => {
    return item.work.id == id;
  })?.work.url_message_video;

  return (
    <>
      <h1 className={styles.evaluation__title}>Оцените Участника</h1>
      <MemberPhotosList
        memberPhotos={
          memberPhotos?.filter((item: any) => item.work.id == id) || []
        }
      />
      <VideoLink workVideo={workVileo} />
      <EvaluationCriteriaForm
        attributes={memberAttributes}
        totalScore={totalScore}
        handleChange={handleChange}
      />
      <Button
        disabled={!isAllAttributesFilled || isResultLoading}
        className={styles.evaluation__modal_btn}
        onClick={() => postResult()}
      >
        {isResultLoading ? "Загрузка..." : "Подтвердить"}
      </Button>
    </>
  );
};
