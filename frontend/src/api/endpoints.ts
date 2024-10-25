export const BASE_API_URL = import.meta.env.VITE_SOME_KEY;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_API_URL}/api/v1/register/`,
    LOGIN: `${BASE_API_URL}/api/v1/token/`,
    REFRESH: `${BASE_API_URL}/api/v1/token/refresh/`,
    SMS_CALL: `${BASE_API_URL}/api/v1/users/login_in/`,
  },
  USERS: {
    ME: `${BASE_API_URL}/api/v1/users/me/`,
    USER: `${BASE_API_URL}/api/v1/users/`,
  },
};
