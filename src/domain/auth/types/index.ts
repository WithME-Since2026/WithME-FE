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

export type CheckLoginIdRequest = {
  loginId: string;
};

export type CheckLoginIdResponse = {
  isDuplicated: boolean;
};

export type SignUpRequest = {
  loginId: string;
  password: string;
  agreeMarketing: boolean;
};

export type SignUpResponse = {
  userId: number;
};
