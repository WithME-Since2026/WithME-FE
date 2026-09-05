import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

// 프로필 사진을 설정하지 않은 사용자에게 보여줄 기본 이미지 (Figma 마이페이지 목업의 기본 아바타)
import defaultAvatar from '@/assets/images/profile.png';

import type { MyPageProfileResponse } from '@/domain/mypage/types';

type ProfileCardProps = {
  profile: MyPageProfileResponse;
  onEditPress: () => void;
};

export function ProfileCard({ profile, onEditPress }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={profile.profileImg ? { uri: profile.profileImg } : defaultAvatar}
        style={styles.avatar}
      />

      <Text style={styles.nickname}>{profile.nickname}</Text>

      {profile.isKakaoLinked && (
        <View style={styles.kakaoBadge}>
          <View style={styles.kakaoBadgeDot} />
          <Text style={styles.kakaoBadgeLabel}>카카오 계정 연결됨</Text>
        </View>
      )}

      <Pressable style={styles.editButton} onPress={onEditPress} hitSlop={8}>
        <Text style={styles.editButtonLabel}>편집</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    // Figma 실제 값: 0px 2px 5px rgba(26,26,26,0.06)
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    position: 'absolute',
    left: spacing.md,
    top: 14,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  nickname: {
    ...typography.body1,
    fontWeight: '700',
    fontSize: 17,
    color: colors.textStrong,
    marginLeft: 62,
  },
  kakaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginLeft: 62,
    marginTop: 9,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.kakaoBadgeBg,
    alignSelf: 'flex-start',
  },
  kakaoBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.kakaoBadgeDot,
  },
  kakaoBadgeLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.kakaoBadgeText,
  },
  editButton: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -18 }],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonLabel: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '500',
    color: colors.linkBlue,
  },
});
