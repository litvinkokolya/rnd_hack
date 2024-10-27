import { IResult } from "common/features/evaluation-member/lib";
import { ENDPOINTS } from "../endpoints";
import { axiosInstanse } from "../instanse";
import { AxiosPromise } from "axios";

export const getMemberAssessmentsAttributes = (
  memberId: number
): AxiosPromise<[]> =>
  axiosInstanse.get(
    ENDPOINTS.ASSESSMENTS.ATTRIBUTE + "?nomination__nom__categ__id=" + memberId
  );

export const setMemberResults = (
  data: Partial<IResult>
): AxiosPromise<IResult> =>
  axiosInstanse.post(ENDPOINTS.ASSESSMENTS.RESULTS, data);

export const getAchievements = (): AxiosPromise<any[]> =>
  axiosInstanse.get(ENDPOINTS.ACHIEVEMENTS.ACHIEVEMENTS);

export const getMemberResults = (workId: number): AxiosPromise<IResult[]> =>
  axiosInstanse.get(ENDPOINTS.ASSESSMENTS.RESULTS + "?work=" + workId);
