export type UserProfileResponse = {
  userId: number;
  nickname: string;
  residence: string;
  introduction: string | null;
};

export type UpdateProfileRequest = {
  nickname: string;
  residence: string;
  introduction?: string;
};
