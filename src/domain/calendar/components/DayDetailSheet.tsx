import { useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { CALENDAR_LAYER_COLORS } from '@/domain/calendar/constants/calendarLayers';
import type { CalendarEventResponse } from '@/domain/calendar/types';

type DayDetailSheetProps = {
  visible: boolean;
  dateLabel: string;
  events: CalendarEventResponse[];
  onClose: () => void;
};

// 피그마(784-18713 등)에서만 쓰이는 뉴트럴/톤 컬러. 파란색 계열만 앱 메인 컬러(colors.primary) 기반으로 파생시킴
const NEUTRAL_ICON_BG = '#F3EDF7';
const DIVIDER_COLOR = '#E8E0F0';
const HANDLE_COLOR = '#CAC4D0';
const GROUP_BADGE_BG = `${colors.primary}1A`;
const HOLIDAY_BG = '#FEE2E2';
const HOLIDAY_SUBTITLE_COLOR = '#B91C1C';
const TODO_CHIP_BG = `${CALENDAR_LAYER_COLORS.TODO}17`;

// 날짜를 탭했을 때 뜨는 하단 시트. 그 날의 모임/할 일/공휴일을 종류별로 보여줌
export function DayDetailSheet({ visible, dateLabel, events, onClose }: DayDetailSheetProps) {
  // TODO: 할 일 완료 상태는 백엔드 연동 전까지 시트 안에서만 유지되는 로컬 상태
  const [locallyCompletedIds, setLocallyCompletedIds] = useState<Set<number>>(new Set());

  const holidayEvents = events.filter((event) => event.type === 'HOLIDAY');
  const groupEvents = events.filter((event) => event.type === 'GROUP');
  const todoEvents = events.filter((event) => event.type === 'TODO');
  const pendingTodos = todoEvents.filter((event) => !locallyCompletedIds.has(event.eventId));
  const doneTodos = todoEvents.filter((event) => locallyCompletedIds.has(event.eventId));

  const summaryText = holidayEvents.length
    ? holidayEvents.map((event) => event.title).join(', ')
    : [
        groupEvents.length > 0 && `모임 ${groupEvents.length}개`,
        todoEvents.length > 0 && `할 일 ${todoEvents.length}개`,
      ]
        .filter(Boolean)
        .join(' · ') || '일정 없음';

  const isEmpty = events.length === 0;

  const handleToggleTodo = (eventId: number) => {
    setLocallyCompletedIds((prev) => {
      const next = new Set(prev);

      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }

      return next;
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.dragHandleRow}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              <Text
                style={[
                  styles.summaryLabel,
                  holidayEvents.length > 0 && styles.summaryLabelHoliday,
                ]}
              >
                {summaryText}
              </Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}
              accessibilityLabel="닫기"
            >
              <Ionicons name="close" size={16} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {isEmpty ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={26} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>이 날은 비어있어요</Text>
              <Text style={styles.emptySubtitle}>할 일을 추가해보세요</Text>
            </View>
          ) : (
            <View style={styles.body}>
              {holidayEvents.map((event) => (
                <View key={event.eventId} style={styles.holidayCard}>
                  <View style={styles.holidayDot} />
                  <View>
                    <Text style={styles.holidayTitle}>{event.title}</Text>
                    <Text style={styles.holidaySubtitle}>{event.badgeLabel}</Text>
                  </View>
                </View>
              ))}

              {groupEvents.map((event) => (
                <View key={event.eventId} style={styles.groupCard}>
                  <View style={styles.groupBar} />
                  <View style={styles.groupContent}>
                    <View style={styles.groupTopRow}>
                      <View style={styles.groupBadge}>
                        <Text style={styles.groupBadgeText}>WithME</Text>
                      </View>
                    </View>
                    <Text style={styles.groupTitle}>{event.title}</Text>
                    {event.time && (
                      <View style={styles.groupMetaRow}>
                        <Ionicons name="time-outline" size={11} color={colors.text.secondary} />
                        <Text style={styles.groupMetaText}>{event.time}</Text>
                      </View>
                    )}
                    {event.location && (
                      <View style={styles.groupLocationRow}>
                        <Ionicons name="location-outline" size={11} color={colors.text.secondary} />
                        <Text style={styles.groupMetaText}>{event.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {pendingTodos.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>할 일</Text>
                  {pendingTodos.map((event) => (
                    <View key={event.eventId} style={styles.todoCard}>
                      <View style={styles.todoBar} />
                      <View style={styles.todoContentRow}>
                        <Pressable
                          onPress={() => handleToggleTodo(event.eventId)}
                          hitSlop={8}
                          accessibilityLabel="할 일 완료 처리"
                        >
                          <View style={styles.todoCheckbox} />
                        </Pressable>
                        <View style={styles.todoTextGroup}>
                          <Text style={styles.todoTitle}>{event.title}</Text>
                          <View style={styles.todoChip}>
                            <Text style={styles.todoChipText}>{event.badgeLabel}</Text>
                          </View>
                        </View>
                        <View style={styles.kebabButton}>
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={18}
                            color={colors.text.secondary}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {doneTodos.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>완료됨</Text>
                  {doneTodos.map((event) => (
                    <Pressable
                      key={event.eventId}
                      style={styles.doneTodoRow}
                      onPress={() => handleToggleTodo(event.eventId)}
                    >
                      <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                      <Text style={[styles.todoTitle, styles.todoTitleDone]}>{event.title}</Text>
                    </Pressable>
                  ))}
                </>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <Pressable style={styles.addButton} hitSlop={8}>
              <Ionicons name="add" size={18} color={colors.background} />
              <Text style={styles.addButtonText}>할 일 추가</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
  },
  dragHandleRow: {
    alignItems: 'center',
    paddingTop: 10,
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: HANDLE_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  headerText: {
    gap: 2,
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5,
    color: '#49454F',
  },
  summaryLabelHoliday: {
    fontWeight: '500',
    color: CALENDAR_LAYER_COLORS.HOLIDAY,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: NEUTRAL_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER_COLOR,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: 16,
    gap: spacing.xs,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: spacing.sm,
  },
  holidayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: HOLIDAY_BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  holidayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CALENDAR_LAYER_COLORS.HOLIDAY,
  },
  holidayTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: CALENDAR_LAYER_COLORS.HOLIDAY,
  },
  holidaySubtitle: {
    fontSize: 11,
    color: HOLIDAY_SUBTITLE_COLOR,
    marginTop: 1,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: NEUTRAL_ICON_BG,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  groupBar: {
    width: 4,
    backgroundColor: colors.primary,
  },
  groupContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  groupTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupBadge: {
    backgroundColor: GROUP_BADGE_BG,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  groupBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: 5,
  },
  groupMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  groupLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  groupMetaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.88,
    color: '#49454F',
  },
  todoCard: {
    flexDirection: 'row',
    backgroundColor: NEUTRAL_ICON_BG,
    borderRadius: 14,
    overflow: 'hidden',
  },
  todoBar: {
    width: 4,
    backgroundColor: CALENDAR_LAYER_COLORS.TODO,
  },
  todoContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 11,
  },
  todoCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: CALENDAR_LAYER_COLORS.TODO,
  },
  todoTextGroup: {
    flex: 1,
    gap: 4,
  },
  todoTitle: {
    fontSize: 14,
    color: colors.text.primary,
  },
  todoTitleDone: {
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  todoChip: {
    alignSelf: 'flex-start',
    backgroundColor: TODO_CHIP_BG,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  todoChipText: {
    fontSize: 10,
    fontWeight: '500',
    color: CALENDAR_LAYER_COLORS.TODO,
  },
  kebabButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTodoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: DIVIDER_COLOR,
    paddingHorizontal: 16,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 13,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.background,
  },
});
