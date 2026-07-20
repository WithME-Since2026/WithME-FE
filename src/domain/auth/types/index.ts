export type LoginRequest = {
  loginId: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userId: number;
};

export type ReissueRequest = {
  refreshToken: string;
};

export type ReissueResponse = {
  accessToken: string;
  refreshToken: string;
};
