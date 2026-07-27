import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { useUpdateProfileMutation } from '@/domain/user/hooks/useUpdateProfileMutation';

const NAME_MAX_LENGTH = 20;

type NameInputScreenProps = NativeStackScreenProps<RootStackParamList, 'NameInput'>;

// 최초 로그인 후 프로필 이름을 확인/입력하는 화면
export function NameInputScreen({ navigation }: NameInputScreenProps) {
  const [name, setName] = useState('');

<<<<<<< HEAD
  const updateProfileMutation = useUpdateProfileMutation();
=======
  // "value"로 완전히 controlled하면 매 keystroke마다 네이티브 입력 버퍼를 React가
  // 다시 덮어써서, iOS에서는 빠른 타이핑 시 글자가 씹히고 안드로이드에서는 한글 조합
  // 중인 텍스트가 끊겨 입력이 막힘. defaultValue로 두고 onChangeText만 구독해
  // 네이티브 버퍼를 그대로 두는 방식으로 회피
  const isNameTooLong = name.length > NAME_MAX_LENGTH;
>>>>>>> 5d7cc96 (키보드 입력 짤림 문제 해결)

  const handleComplete = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    updateProfileMutation.mutate(
      {
        nickname: trimmedName,
        residence: '', // TODO: 거주지 입력 화면 추가 시 수정
      },
      {
        onSuccess: () => {
          // TODO: 프로필 업데이트 후 이동할 메인 화면 추가 시 수정 (현재는 임시로 Login으로 이동)
          navigation.replace('Login');
        },
      },
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
          <Text style={styles.title}>반가워요! 이름을 입력해주세요</Text>
          <Text style={styles.helperText}>나중에 마이페이지에서 언제든 수정할 수 있어요</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.trim() ? name.trim()[0] : '?'}</Text>
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

<<<<<<< HEAD
          <Button
            label="완료"
            onPress={handleComplete}
            loading={updateProfileMutation.isPending}
            disabled={!name.trim()}
          />
=======
          <View style={styles.footer}>
            <Button
              label="완료"
              onPress={handleComplete}
              disabled={!name.trim() || isNameTooLong}
            />
          </View>
>>>>>>> 5d7cc96 (키보드 입력 짤림 문제 해결)
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
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  avatarText: {
    ...typography.heading1,
    color: colors.background,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeIcon: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  counter: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'right',
    marginTop: -spacing.sm,
    marginBottom: spacing.xl,
  },
  counterError: {
    color: colors.error,
  },
});
