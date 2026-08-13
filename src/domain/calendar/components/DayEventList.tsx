import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { CALENDAR_LAYERS } from '@/domain/calendar/constants/calendarLayers';
import type { CalendarEventResponse } from '@/domain/calendar/types';

type DayEventListProps = {
  dateLabel: string;
  events: CalendarEventResponse[];
};

// 선택한 날짜의 일정을 시간순으로 보여주는 캘린더 하단 상세 패널
export function DayEventList({ dateLabel, events }: DayEventListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateLabel}>{dateLabel}</Text>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>등록된 일정이 없습니다.</Text>
      ) : (
        events.map((event, index) => {
          const layer = CALENDAR_LAYERS.find((l) => l.key === event.type);

          return (
            <View
              key={event.eventId}
              style={[styles.row, index === events.length - 1 && styles.rowLast]}
            >
              <View style={[styles.rowBar, { backgroundColor: layer?.dotColor }]} />
              <View style={styles.rowContent}>
                {event.time && <Text style={styles.time}>{event.time}</Text>}
                <Text style={styles.title}>{event.title}</Text>
                <View style={[styles.badge, { backgroundColor: `${layer?.dotColor}1A` }]}>
                  <Text style={[styles.badgeText, { color: layer?.dotColor }]}>
                    {event.badgeLabel}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  dateLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.secondary,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowBar: {
    width: 3,
    borderRadius: borderRadius.sm,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  time: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  title: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: 2,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
});
