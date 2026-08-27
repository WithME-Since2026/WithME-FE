import { useState } from 'react';

import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';
import defaultAvatar from '@/assets/images/profile.png';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';
import { useMyPageProfileQuery } from '@/domain/mypage/hooks/useMyPageProfileQuery';
import { useUpdateMyPageProfileMutation } from '@/domain/mypage/hooks/useUpdateMyPageProfileMutation';

type ProfileEditScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileEdit'>;

// 프로필(사진/닉네임/연결 계정)을 관리하는 화면 (Figma node 698:4976).
// 알림 설정은 이 화면이 아니라 마이페이지 설정 목록에서 바로 펼쳐지는 인라인 패널로 분리되어 있다.
export function ProfileEditScreen({ navigation }: ProfileEditScreenProps) {
  const { data: profile, isLoading, isError } = useMyPageProfileQuery();
  const updateProfileMutation = useUpdateMyPageProfileMutation();

  const [name, setName] = useState(profile?.nickname ?? '');

  // TODO: 이미지 업로드 API/이미지 피커 라이브러리가 아직 없어 우선 자리만 만들어 둠
  const handleChangePhoto = () => {};

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    updateProfileMutation.mutate(
      { nickname: trimmedName },
      { onSuccess: () => navigation.navigate('MyPage') },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('MyPage')}
          hitSlop={8}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>프로필 편집</Text>
        <Pressable
          onPress={handleSave}
          disabled={updateProfileMutation.isPending}
          hitSlop={8}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>저장</Text>
        </Pressable>
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="프로필 정보를 불러오지 못했습니다." />}

      {!isLoading && !isError && profile && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={profile.profileImg ? { uri: profile.profileImg } : defaultAvatar}
                style={styles.avatar}
              />
              <Pressable style={styles.avatarBadge} onPress={handleChangePhoto} hitSlop={8}>
                <Ionicons name="camera" size={13} color={colors.background} />
              </Pressable>
            </View>
            <Pressable onPress={handleChangePhoto} hitSlop={8}>
              <Text style={styles.changePhotoLabel}>사진 변경</Text>
            </Pressable>
          </View>

          <View style={styles.nameField}>
            <Text style={styles.nameFieldLabel}>이름</Text>
            {/* defaultValue + onChangeText 조합 이유: NameInputScreen 참고 (완전 controlled 시 iOS 빠른 입력/한글 조합 중 입력 씹힘) */}
            <TextInput
              style={styles.nameFieldInput}
              defaultValue={name}
              onChangeText={setName}
              maxLength={20}
              placeholderTextColor={colors.text.disabled}
            />
          </View>

          {profile.isKakaoLinked && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>연결된 계정</Text>
              <View style={styles.accountRow}>
                <KakaoIcon size={38} background />
                <View style={styles.accountBody}>
                  <Text style={styles.accountName}>카카오</Text>
                  {/* TODO: 백엔드에 카카오 계정 이메일 필드가 아직 없어 자리만 만들어 둠 */}
                  <Text style={styles.accountEmail}>honggildong@kakao.com</Text>
                </View>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedLabel}>연결됨</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.notifDivider,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.body1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  saveButton: {
    height: 44,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    // Figma 실제 값: 0px 6px 10px rgba(92,86,212,0.31)
    shadowColor: '#5C56D4',
    shadowOpacity: 0.31,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  nameField: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 14,
    marginBottom: spacing.md,
  },
  nameFieldLabel: {
    ...typography.caption,
    color: colors.notifReadText,
    marginBottom: spacing.sm,
  },
  nameFieldInput: {
    ...typography.body1,
    fontSize: 16,
    color: colors.text.primary,
    padding: 0,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 14,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.caption,
    color: colors.notifReadText,
    marginBottom: spacing.sm,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Figma 실제 값(아이콘~텍스트 간격 12px)
    gap: 12,
  },
  accountBody: {
    flex: 1,
  },
  accountName: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  accountEmail: {
    ...typography.caption,
    fontSize: 12,
    color: colors.notifReadText,
    marginTop: 2,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
    backgroundColor: colors.notifReceivedBg,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.notifReceivedIcon,
  },
  connectedLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.notifReceivedIcon,
  },
});
