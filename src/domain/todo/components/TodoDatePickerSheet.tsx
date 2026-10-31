import { useEffect, useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import {
  formatDateKey,
  formatMonthLabel,
  getMondayStartMonthGrid,
  parseDateKey,
  WEEKDAY_LABELS_KO_MON_START,
} from '@/common/utils/date';

type TodoDatePickerSheetProps = {
  visible: boolean;
  selectedDateKey: string;
  onConfirm: (dateKey: string) => void;
  onClose: () => void;
};

// "새 할 일" 시트의 날짜 행에서 열리는 달력 바텀시트 (Figma 784-19414)
// 캘린더 메인뷰(MonthCalendarGrid)와 같은 월요일 시작 그리드·배지 스타일을 재사용해 톤을 맞춘다
export function TodoDatePickerSheet({
  visible,
  selectedDateKey,
  onConfirm,
  onClose,
}: TodoDatePickerSheetProps) {
  const [viewDate, setViewDate] = useState(() => parseDateKey(selectedDateKey));
  const [tempDateKey, setTempDateKey] = useState(selectedDateKey);

  useEffect(() => {
    if (visible) {
      setViewDate(parseDateKey(selectedDateKey));
      setTempDateKey(selectedDateKey);
    }
  }, [visible, selectedDateKey]);

  // 닫혀 있을 때도 Modal이 계속 마운트되어 있으면 부모 시트(TodoCreateSheet)의 TextInput이
  // 포커스를 못 잡는 문제가 있어(동시에 여러 개 <Modal>이 트리에 존재), 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const todayKey = formatDateKey(new Date());

  const cells = getMondayStartMonthGrid(year, month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  ).filter((week) => week.some((cell) => cell.isCurrentMonth));

  const handleChangeMonth = (offset: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleConfirm = () => {
    onConfirm(tempDateKey);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetPositioner} pointerEvents="box-none">
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={onClose}
                hitSlop={8}
                accessibilityLabel="뒤로"
              >
                <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
              </Pressable>
              <Text style={styles.title}>날짜 선택</Text>
            </View>

            <View style={styles.monthNavRow}>
              <Pressable
                style={styles.navButton}
                onPress={() => handleChangeMonth(-1)}
                hitSlop={8}
                accessibilityLabel="이전 달"
              >
                <Ionicons name="chevron-back" size={18} color={colors.text.secondary} />
              </Pressable>
              <Text style={styles.monthLabel}>{formatMonthLabel(year, month)}</Text>
              <Pressable
                style={styles.navButton}
                onPress={() => handleChangeMonth(1)}
                hitSlop={8}
                accessibilityLabel="다음 달"
              >
                <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS_KO_MON_START.map((label, index) => (
                <Text
                  key={label}
                  style={[
                    styles.weekdayLabel,
                    index === 5 && styles.saturdayLabel,
                    index === 6 && styles.sundayLabel,
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>

            {weeks.map((week) => (
              <View key={week[0].dateKey} style={styles.weekRow}>
                {week.map((cell, columnIndex) => {
                  if (!cell.isCurrentMonth) {
                    return <View key={cell.dateKey} style={styles.cell} />;
                  }

                  const isToday = cell.dateKey === todayKey;
                  const isSelected = cell.dateKey === tempDateKey;

                  return (
                    <Pressable
                      key={cell.dateKey}
                      style={styles.cell}
                      onPress={() => setTempDateKey(cell.dateKey)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View
                        style={[
                          styles.dayBadge,
                          isToday && !isSelected && styles.todayBadge,
                          isSelected && styles.selectedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayLabel,
                            columnIndex === 5 && styles.saturdayLabel,
                            columnIndex === 6 && styles.sundayLabel,
                            isSelected && styles.selectedLabel,
                          ]}
                        >
                          {cell.date.getDate()}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <Button label="선택 완료" onPress={handleConfirm} style={styles.confirmButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheetPositioner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CAC4D0',
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    fontSize: 11,
    fontWeight: '500',
    color: '#49454F',
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadge: {
    backgroundColor: `${colors.primary}1A`,
  },
  selectedBadge: {
    borderRadius: borderRadius.md + 2,
    backgroundColor: colors.primary,
  },
  dayLabel: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.primary,
  },
  saturdayLabel: {
    color: colors.weekend,
  },
  sundayLabel: {
    color: colors.weekend,
    fontWeight: '700',
  },
  selectedLabel: {
    color: colors.background,
    fontWeight: '700',
  },
  confirmButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.full,
  },
});
