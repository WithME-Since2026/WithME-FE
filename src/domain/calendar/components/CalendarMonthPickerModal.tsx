import { useEffect, useRef, useState } from 'react';

import type { GestureResponderEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const PADDING_COUNT = Math.floor(VISIBLE_COUNT / 2);
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

const YEAR_RANGE = 10;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type CalendarMonthPickerModalProps = {
  visible: boolean;
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
};

type WheelColumnProps = {
  values: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  formatLabel: (value: number) => string;
};

// 값 목록을 세로로 스크롤해 원하는 값을 고르는 휠 피커 컬럼 (연도/월 공용)
function WheelColumn({ values, selectedValue, onChange, formatLabel }: WheelColumnProps) {
  const listRef = useRef<FlatList<number>>(null);
  const initialIndex = Math.max(values.indexOf(selectedValue), 0);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.min(Math.max(Math.round(offsetY / ITEM_HEIGHT), 0), values.length - 1);

    onChange(values[index]);
    listRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
  };

  return (
    <FlatList
      ref={listRef}
      data={values}
      keyExtractor={(value) => String(value)}
      style={styles.wheelColumn}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * PADDING_COUNT }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
      contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      renderItem={({ item }) => {
        const isSelected = item === selectedValue;

        return (
          <View style={styles.wheelItem}>
            <Text style={[styles.wheelItemText, isSelected && styles.wheelItemTextSelected]}>
              {formatLabel(item)}
            </Text>
          </View>
        );
      }}
    />
  );
}

// 월 라벨을 눌렀을 때 뜨는 연/월 선택 팝업. 스크롤 휠로 원하는 연도·월을 골라 완료 시 이동
export function CalendarMonthPickerModal({
  visible,
  year,
  month,
  onSelect,
  onClose,
}: CalendarMonthPickerModalProps) {
  const [pickerYear, setPickerYear] = useState(year);
  const [pickerMonth, setPickerMonth] = useState(month);

  useEffect(() => {
    if (visible) {
      setPickerYear(year);
      setPickerMonth(month);
    }
  }, [visible, year, month]);

  const years = Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, index) => year - YEAR_RANGE + index);

  const stopPropagation = (event: GestureResponderEvent) => {
    event.stopPropagation();
  };

  const handleConfirm = () => {
    onSelect(pickerYear, pickerMonth);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={stopPropagation}>
          <View style={styles.header}>
            <Text style={styles.title}>연/월 선택</Text>
            <Pressable onPress={handleConfirm} hitSlop={8}>
              <Text style={styles.doneText}>완료</Text>
            </Pressable>
          </View>

          <View style={styles.wheelContainer}>
            <View pointerEvents="none" style={styles.wheelHighlight} />
            <WheelColumn
              values={years}
              selectedValue={pickerYear}
              onChange={setPickerYear}
              formatLabel={(value) => `${value}년`}
            />
            <WheelColumn
              values={MONTHS}
              selectedValue={pickerMonth}
              onChange={setPickerMonth}
              formatLabel={(value) => `${value}월`}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'stretch',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 1.5,
  },
  sheet: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  doneText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.primary,
  },
  wheelContainer: {
    flexDirection: 'row',
    height: WHEEL_HEIGHT,
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * PADDING_COUNT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: `${colors.primary}0D`,
  },
  wheelColumn: {
    flex: 1,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    ...typography.body1,
    color: colors.text.disabled,
  },
  wheelItemTextSelected: {
    ...typography.heading3,
    color: colors.text.primary,
  },
});
