import { useState } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/common/api/apiError';
import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';
import profileImage from '@/assets/images/profile.png';

import { useSignUpMutation } from '@/domain/auth/hooks/useSignUpMutation';

const NAME_MAX_LENGTH = 20;

type NameInputScreenProps = NativeStackScreenProps<RootStackParamList, 'NameInput'>;

// 회원가입 마지막 단계: 이름을 입력받아 앞 화면의 가입 정보와 함께 회원가입 API 호출
export function NameInputScreen({ navigation, route }: NameInputScreenProps) {
  const [name, setName] = useState('');

  const signUpMutation = useSignUpMutation();

  // "value"로 완전히 controlled하면 매 keystroke마다 네이티브 입력 버퍼를 React가
  // 다시 덮어써서, iOS에서는 빠른 타이핑 시 글자가 씹히고 안드로이드에서는 한글 조합
  // 중인 텍스트가 끊겨 입력이 막힘. defaultValue로 두고 onChangeText만 구독해
  // 네이티브 버퍼를 그대로 두는 방식으로 회피
  const isNameTooLong = name.length > NAME_MAX_LENGTH;

  const handleComplete = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    signUpMutation.mutate(
      { ...route.params.signUpRequest, nickname: trimmedName },
      // 가입 완료 후 가입 폼/이름 입력으로 뒤로가기 할 수 없도록 스택 초기화
      { onSuccess: () => navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] }) },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>프로필 확인</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>반가워요! 사용할 이름을{'\n'}입력해주세요</Text>
          <Text style={styles.helperText}>나중에 마이페이지에서 언제든 수정할 수 있어요</Text>

          <View style={styles.avatar}>
            <Image source={profileImage} style={styles.avatarImage} />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeIcon}>✎</Text>
            </View>
          </View>

          <TextField
            label="이름"
            placeholder="이름을 입력해주세요"
            defaultValue={name}
            onChangeText={setName}
          />
          <Text style={[styles.counter, isNameTooLong && styles.counterError]}>
            {name.length}/{NAME_MAX_LENGTH}
          </Text>
          {signUpMutation.isError && (
            <Text style={styles.errorText}>
              {getApiErrorMessage(signUpMutation.error, '회원가입에 실패했습니다.')}
            </Text>
          )}

          <View style={styles.footer}>
            <Button
              label="완료"
              onPress={handleComplete}
              loading={signUpMutation.isPending}
              disabled={!name.trim() || isNameTooLong}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  footer: {
    marginTop: 'auto',
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  avatar: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing.xl,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeIcon: {
    fontSize: 14,
    color: colors.background,
  },
  counter: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'right',
    marginTop: -spacing.sm,
    marginBottom: spacing.xs,
  },
  counterError: {
    color: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.xl,
  },
});
