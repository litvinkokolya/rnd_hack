export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  image: null | File | string;
  phone_number: string;
  about_me: string;
  memberId?: number;
  workId?: number;
}

export interface ILoginRequest {
  username: string;
  password: string;
  success?: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}
