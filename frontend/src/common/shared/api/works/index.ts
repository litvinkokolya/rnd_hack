import { IMember } from "common/entities/member";
import { ENDPOINTS } from "../endpoints";
import { axiosInstanse } from "../instanse";
import { AxiosPromise } from "axios";

export const getWorks = (eventd: number): AxiosPromise<IMember[]> =>
  axiosInstanse.get(ENDPOINTS.MEMBERS.MEMBERS + "?event=" + eventd);
