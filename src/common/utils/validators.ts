const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_CODE_LENGTH = 6;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email);
}

export function isValidEmailCode(code: string) {
  return code.length === EMAIL_CODE_LENGTH;
}

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleStatus = {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export function getPasswordRuleStatus(password: string): PasswordRuleStatus {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
}

// 특수문자 포함은 선택 조건이라 필수 통과 조건에서 제외
export function isPasswordValid(password: string) {
  const status = getPasswordRuleStatus(password);
  return status.minLength && status.hasLetter && status.hasNumber;
}
