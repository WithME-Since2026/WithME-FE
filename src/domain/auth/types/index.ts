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
  localId: string;
};

export type CheckLoginIdResponse = {
  isDuplicated: boolean;
};

export type SignUpRequest = {
  localId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  serviceTermsAgreed: boolean;
  privacyPolicyAgreed: boolean;
  marketingAgreed: boolean;
};

export type SignUpResponse = {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
};

export type SendEmailCodeRequest = {
  email: string;
};

// TODO: API 명세(스웨거/노션) 확정 전이라 응답 바디를 임의로 null 처리. 확정되면 필드 반영
export type SendEmailCodeResponse = null;

export type CheckEmailCodeRequest = {
  email: string;
  code: string;
};

// TODO: 실제 응답 필드명(verified 등) 확정되면 수정
export type CheckEmailCodeResponse = {
  verified: boolean;
};

export type FindLoginIdRequest = {
  name: string;
  email: string;
  code: string;
};

export type FindLoginIdResponse = {
  loginId: string;
};

export type ResetPasswordRequest = {
  loginId: string;
  email: string;
  code: string;
  newPassword: string;
};

// TODO: API 명세 확정 전이라 응답 바디를 임의로 null 처리. 확정되면 필드 반영
export type ResetPasswordResponse = null;
