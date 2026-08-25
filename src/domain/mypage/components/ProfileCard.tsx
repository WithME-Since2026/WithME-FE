import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MyPageProfileResponse } from '@/domain/mypage/types';

type ProfileCardProps = {
  profile: MyPageProfileResponse;
  onEditPress: () => void;
};

export function ProfileCard({ profile, onEditPress }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color={colors.text.secondary} />
      </View>

      <Text style={styles.nickname}>{profile.nickname}</Text>

      {profile.isKakaoLinked && (
        <View style={styles.kakaoBadge}>
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
  },
  avatar: {
    position: 'absolute',
    left: spacing.md,
    top: 16,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    ...typography.body1,
    fontWeight: '700',
    fontSize: 17,
    color: colors.text.primary,
    marginLeft: 60,
  },
  kakaoBadge: {
    marginLeft: 60,
    marginTop: spacing.xs,
    height: 22,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.kakao,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoBadgeLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.kakaoBadgeText,
  },
  editButton: {
    position: 'absolute',
    right: spacing.md,
    top: 28,
    height: 26,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonLabel: {
    ...typography.caption,
    color: colors.neutralIcon,
  },
});
