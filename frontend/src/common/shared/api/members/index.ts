import { IMember } from "common/entities/member";
import { ENDPOINTS } from "../endpoints";
import { axiosInstanse } from "../instanse";
import { AxiosPromise } from "axios";
import { IPhoto } from "common/features/upload-member-photo/model";

export const setMember = (params: any): AxiosPromise<IMember> =>
  axiosInstanse.post(ENDPOINTS.MEMBERS.MEMBERS, params);

export const getMembers = (champId: number): AxiosPromise<IMember[]> =>
  axiosInstanse.get(ENDPOINTS.MEMBERS.MEMBERS + "?event=" + champId);

export const getMember = (memberId: number): AxiosPromise<IMember> =>
  axiosInstanse.get(ENDPOINTS.MEMBERS.MEMBERS + memberId + "/");

export const getMemberPhotos = (memberId: number): AxiosPromise<IPhoto[]> =>
  axiosInstanse.get(
    ENDPOINTS.MEMBERS.PHOTOS + "?member_nomination=" + memberId
  );

export const setMemberPhotos = (data: FormData) =>
  axiosInstanse.post(ENDPOINTS.MEMBERS.PHOTOS, data);
