import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { useUpdateProfileMutation } from '@/domain/user/hooks/useUpdateProfileMutation';

const NAME_MAX_LENGTH = 20;

type NameInputScreenProps = NativeStackScreenProps<RootStackParamList, 'NameInput'>;

// 최초 로그인 후 프로필 이름을 확인/입력하는 화면
export function NameInputScreen({ navigation }: NameInputScreenProps) {
  const [name, setName] = useState('');

  const updateProfileMutation = useUpdateProfileMutation();

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>프로필 확인</Text>
          <Text style={styles.subtitle}>반가워요! 이름을 입력해주세요</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.trim() ? name.trim()[0] : '?'}</Text>
          </View>

          <TextField
            label="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChangeText={(value) => setName(value.slice(0, NAME_MAX_LENGTH))}
            maxLength={NAME_MAX_LENGTH}
          />
          <Text style={styles.counter}>
            {name.length}/{NAME_MAX_LENGTH}
          </Text>

          <Button
            label="완료"
            onPress={handleComplete}
            loading={updateProfileMutation.isPending}
            disabled={!name.trim()}
          />
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
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  avatarText: {
    ...typography.heading2,
    color: colors.background,
  },
  counter: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'right',
    marginTop: -spacing.sm,
    marginBottom: spacing.xl,
  },
});
