import { axiosInstanse } from "../instanse";
import { ENDPOINTS } from "../endpoints";
import { AxiosPromise } from "axios";
import { IChamp, IChampNominationsCategories } from "common/entities/champ";

export const createChallenge = (params: any): AxiosPromise<IChamp[]> =>
  axiosInstanse.post(ENDPOINTS.EVENTS.CHAMP, params);

export const patchChallenege = (
  idChamp: any,
  params: any
): AxiosPromise<IChamp[]> =>
  axiosInstanse.patch(ENDPOINTS.EVENTS.CHAMP + idChamp + "/", params);

export const getChamp = (idChamp: number): AxiosPromise<IChamp> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP + idChamp + "/");

export const getChamps = (): AxiosPromise<IChamp[]> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP);

export const getChampWinnersNominations = (
  idChamp: number
): AxiosPromise<IChampNominationsCategories[]> =>
  axiosInstanse.get(
    ENDPOINTS.EVENTS.CHAMP +
      idChamp +
      ENDPOINTS.EVENTS.CHAMP_WINNERS_NOMINATIONS
  );

export const getChampWinnersCategories = (
  idChamp: number
): AxiosPromise<IChampNominationsCategories[]> =>
  axiosInstanse.get(
    ENDPOINTS.EVENTS.CHAMP + idChamp + ENDPOINTS.EVENTS.CHAMP_WINNERS_CATEGORIES
  );
