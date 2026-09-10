import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MeetingAttendeeResponse } from '@/domain/meeting/types';
import { getAvatarColor } from '@/domain/meeting/utils/avatarColor';

type MemberListCardProps = {
  attendees: MeetingAttendeeResponse[];
};

// 운영자 뷰 전용 참석 멤버 상세 리스트 (이름 + 색상 아바타). 인원이 많아지면 화면 스크롤을 따라 자연스럽게 늘어남
export function MemberListCard({ attendees }: MemberListCardProps) {
  return (
    <View style={styles.list}>
      {attendees.map((attendee, index) => (
        <View key={attendee.memberId} style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(index) }]}>
            <Text style={styles.avatarLabel}>{attendee.initial}</Text>
          </View>
          <Text style={styles.name}>{attendee.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.background,
  },
  name: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
