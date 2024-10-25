import { ILoginRequest, ILoginResponse } from "types";
import { axiosInstanse } from "api/instanse";
import { ENDPOINTS } from "api/endpoints";
import { AxiosPromise } from "axios";

export const registerUser = (params: any, code: any) => {
  axiosInstanse.post(ENDPOINTS.AUTH.REGISTER, params);
};

export const login = (params: ILoginRequest): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.LOGIN, params);

export const smsCall = (phone: string): AxiosPromise<ILoginRequest> =>
  axiosInstanse.post(ENDPOINTS.AUTH.SMS_CALL, {
    phone_number: phone,
  });

interface IRefreshTokeRequest {
  refresh: string;
}

export const refreshToken = (
  refreshToken: IRefreshTokeRequest
): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.REFRESH, refreshToken);
