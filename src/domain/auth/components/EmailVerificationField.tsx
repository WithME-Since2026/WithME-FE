import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';
import { formatCountdown } from '@/common/utils/format';

type EmailVerificationFieldProps = {
  email: string;
  onEmailChange: (value: string) => void;
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
  email,
  onEmailChange,
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
      <View style={styles.row}>
        <View style={styles.emailInput}>
          <TextField
            label="이메일"
            placeholder="이메일 주소 입력"
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoComplete="email"
            errorMessage={emailErrorMessage}
          />
        </View>
        <Button
          label={hasSentCode ? '재전송' : '코드발송'}
          onPress={onSendCode}
          loading={isSendingCode}
          disabled={!email || isSendDisabled}
          style={styles.sendButton}
        />
      </View>

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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  emailInput: {
    flex: 1,
  },
  // TextField 컨테이너 하단 marginBottom(spacing.md)만큼 맞춰 idRow와 동일하게 바닥 정렬
  sendButton: {
    marginBottom: spacing.md,
  },
  timerText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.error,
  },
});
