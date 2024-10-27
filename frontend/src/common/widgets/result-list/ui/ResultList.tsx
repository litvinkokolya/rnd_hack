import { getMemberResults } from "common/shared/api/assessments";
import { getMemberPhotos, getMember } from "common/shared/api/members";
import { Loader } from "common/shared/ui/loader";
import { MemberPhotosList } from "common/widgets/member-photos-list";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQuery } from "react-query";
import styles from "./ResultList.module.scss";
import { IResult } from "common/features/evaluation-member/lib";

export const ResultList = () => {
  const router = useRouter();
  const { memberId: id } = router.query;
  const workId = Number(router.query.memberId);

  const { data: resultData, isLoading: resultDataDataIsLoading } = useQuery(
    "memberResult",
    () => getMemberResults(workId),
    {
      enabled: !!workId,
      refetchOnWindowFocus: true,
      //запрос раз в 5 минут
      refetchInterval: 50 * 60 * 100,
    }
  );

  const { data: memberPhotosData, isLoading: memberPhotosDataIsLoading } =
    useQuery("memberPhotos", () => getMemberPhotos(workId), {
      enabled: !!workId,
    });

  console.log(resultData?.data);

  const criteries = useMemo(() => {
    return resultData?.data[0]?.score
      ? Object.keys(resultData.data[0].score)
      : [];
  }, [resultData]);

  if (resultDataDataIsLoading || memberPhotosDataIsLoading) {
    return <Loader fullPage />;
  }

  return (
    <>
      <MemberPhotosList
        memberPhotos={memberPhotosData?.data.filter(
          (item: any) => item.work.id == id
        )}
      />
      {!!resultData?.data.length ? (
        <>
          <div className={styles.result__box}>
            <ul className={styles.result__list}>
              {criteries.map((criteria, index, criteries) => (
                <li key={index} className={styles.result__item}>
                  <p className={styles.result__criteria}>{criteria}</p>
                  <p className={styles.result__score}>
                    {resultData?.data.map(
                      (item: IResult, itemIndex: number) => (
                        <div key={itemIndex}>
                          {/* @ts-ignore */}
                          <span>{item.score![criteria]}</span>
                          {index === criteries.length - 1 && (
                            <p className={styles.result__staff}>
                              {/* @ts-ignore */}
                              {item.full_name_reviewer}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
