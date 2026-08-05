import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';
import { formatCountdown } from '@/common/utils/format';

import { EmailDomainField } from '@/domain/auth/components/EmailDomainField';

type EmailVerificationFieldProps = {
  emailLocal: string;
  onEmailLocalChange: (value: string) => void;
  emailDomain: string;
  onEmailDomainChange: (value: string) => void;
  // 코드발송 버튼 활성화 조건 판단에 사용하는, local@domain으로 조합된 전체 이메일
  email: string;
  emailErrorMessage?: string;
  hasSentCode: boolean;
  isSendingCode: boolean;
  onSendCode: () => void;
  code: string;
  onCodeChange: (value: string) => void;
  codeErrorMessage?: string;
  remainingSeconds: number;
  // 이메일 형식이 올바르지 않을 때 등, email 존재 여부 외의 이유로 전송 버튼을 막아야 할 때 사용
  isSendDisabled?: boolean;
};

// 이메일 입력 + 인증코드 전송 + 인증코드 입력 + 만료 타이머를 묶은 계정 찾기/가입 공용 인증 UI
export function EmailVerificationField({
  emailLocal,
  onEmailLocalChange,
  emailDomain,
  onEmailDomainChange,
  email,
  emailErrorMessage,
  hasSentCode,
  isSendingCode,
  onSendCode,
  code,
  onCodeChange,
  codeErrorMessage,
  remainingSeconds,
  isSendDisabled = false,
}: EmailVerificationFieldProps) {
  const isCodeExpired = hasSentCode && remainingSeconds <= 0;

  return (
    <View>
      <EmailDomainField
        label="이메일"
        local={emailLocal}
        onLocalChange={onEmailLocalChange}
        domain={emailDomain}
        onDomainChange={onEmailDomainChange}
        errorMessage={emailErrorMessage}
        actionElement={
          <Button
            label={hasSentCode ? '재전송' : '코드발송'}
            onPress={onSendCode}
            loading={isSendingCode}
            disabled={!email || isSendDisabled}
            style={styles.sendButton}
          />
        }
      />

      {hasSentCode && (
        <TextField
          label="인증코드"
          placeholder="인증코드 6자리"
          value={code}
          onChangeText={onCodeChange}
          keyboardType="number-pad"
          errorMessage={
            codeErrorMessage ??
            (isCodeExpired ? '인증번호가 만료되었습니다. 재전송해주세요.' : undefined)
          }
          rightElement={
            !isCodeExpired && !codeErrorMessage ? (
              <Text style={styles.timerText}>{formatCountdown(remainingSeconds)}</Text>
            ) : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // 이메일 박스들과 한 줄에 나란히 배치되므로 기본 버튼보다 좁게 조정
  sendButton: {
    paddingHorizontal: spacing.sm,
  },
  timerText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.error,
  },
});
