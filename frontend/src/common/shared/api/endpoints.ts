export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const BEAUTY_RANK_BOT = process.env.NEXT_PUBLIC_BEAUTY_RANK_BOT;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_API_URL}/api/v1/token/`,
    REFRESH: `${BASE_API_URL}/api/v1/token/refresh/`,
    SMS_CALL: `${BASE_API_URL}/api/v1/users/login_in/`,
  },
  USERS: {
    ME: `${BASE_API_URL}/api/v1/users/me/`,
    USER: `${BASE_API_URL}/api/v1/users/`,
  },
  MEMBERS: {
    MEMBERS: `${BASE_API_URL}/api/v1/members/`,
    PHOTOS: `${BASE_API_URL}/api/v1/image_works/`,
  },
  WORKS: {
    WORKS: `${BASE_API_URL}/api/v1/works/`,
  },
  EVENTS: {
    CHAMP: `${BASE_API_URL}/api/v1/events/`,
    CHAMP_WINNERS_NOMINATIONS: `/winners_nominations/`,
    CHAMP_WINNERS_CATEGORIES: `/winners_of_categories/`,
  },
  ASSESSMENTS: {
    ATTRIBUTE: `${BASE_API_URL}/api/v1/nominationAttribute/`,
    RESULTS: `${BASE_API_URL}/api/v1/result/`,
  },
};
