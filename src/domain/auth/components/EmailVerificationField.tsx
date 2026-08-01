import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';
import { formatCountdown } from '@/common/utils/format';
import { EMAIL_CODE_LENGTH } from '@/common/utils/validators';

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
          maxLength={EMAIL_CODE_LENGTH}
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
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  emailInput: {
    flex: 1,
  },
  // 이메일 형식 에러 메시지가 뜨면 TextField 전체 높이가 늘어나 flex-end 정렬 시
  // 버튼이 입력창과 어긋나므로, label 높이(lineHeight+marginBottom)만큼 marginTop을
  // 줘서 입력창 상단에 버튼 상단을 고정 정렬한다.
  sendButton: {
    marginTop: typography.body2.lineHeight + spacing.xs,
  },
  timerText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.error,
  },
});
