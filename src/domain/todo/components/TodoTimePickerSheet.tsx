import { useEffect, useRef, useState } from 'react';

import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const PADDING_COUNT = Math.floor(VISIBLE_COUNT / 2);
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

type Period = '오전' | '오후';

const PERIODS: Period[] = ['오전', '오후'];
const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

type TodoTimePickerSheetProps = {
  visible: boolean;
  // parseKoreanTimeToMinutes와 동일한 "오전 11:00" 포맷
  initialTime: string | null;
  // null이면 "선택 안 함"으로 시간 설정을 비웠다는 의미
  onConfirm: (time: string | null) => void;
  onClose: () => void;
};

type WheelColumnProps<T> = {
  values: T[];
  selectedValue: T;
  onChange: (value: T) => void;
  formatLabel: (value: T) => string;
  selectedColor?: string;
  style?: object;
};

// 값 목록을 세로로 스크롤해 원하는 값을 고르는 휠 피커 컬럼 (오전/오후·시·분 공용)
function WheelColumn<T>({
  values,
  selectedValue,
  onChange,
  formatLabel,
  selectedColor = colors.text.primary,
  style,
}: WheelColumnProps<T>) {
  const listRef = useRef<FlatList<T>>(null);
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
      style={[styles.wheelColumn, style]}
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
            <Text
              style={[
                styles.wheelItemText,
                isSelected && [styles.wheelItemTextSelected, { color: selectedColor }],
              ]}
            >
              {formatLabel(item)}
            </Text>
          </View>
        );
      }}
    />
  );
}

function parseInitialTime(time: string | null) {
  const match = time?.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);

  if (!match) {
    return { period: '오전' as Period, hour: 9, minute: 0 };
  }

  const [, period, hourText, minuteText] = match;

  return { period: period as Period, hour: Number(hourText), minute: Number(minuteText) };
}

// "새 할 일" 시트의 시간 행에서 열리는 오전/오후·시·분 휠 피커 바텀시트 (Figma 6f 시간 선택기)
export function TodoTimePickerSheet({
  visible,
  initialTime,
  onConfirm,
  onClose,
}: TodoTimePickerSheetProps) {
  const [period, setPeriod] = useState<Period>('오전');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (visible) {
      const parsed = parseInitialTime(initialTime);
      setPeriod(parsed.period);
      setHour(parsed.hour);
      setMinute(parsed.minute);
    }
  }, [visible, initialTime]);

  // 닫혀 있을 때도 Modal이 계속 마운트되어 있으면 부모 시트(TodoCreateSheet)의 TextInput이
  // 포커스를 못 잡는 문제가 있어(동시에 여러 개 <Modal>이 트리에 존재), 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(`${period} ${hour}:${String(minute).padStart(2, '0')}`);
    onClose();
  };

  const handleClear = () => {
    onConfirm(null);
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
              <Text style={styles.title}>시간 선택</Text>
            </View>

            <View style={styles.wheelContainer}>
              <View pointerEvents="none" style={styles.wheelHighlight} />

              <WheelColumn
                style={styles.periodColumn}
                values={PERIODS}
                selectedValue={period}
                onChange={setPeriod}
                formatLabel={(value) => value}
                selectedColor={colors.primary}
              />
              <WheelColumn
                values={HOURS}
                selectedValue={hour}
                onChange={setHour}
                formatLabel={(value) => String(value)}
              />
              <Text style={styles.colon}>:</Text>
              <WheelColumn
                values={MINUTES}
                selectedValue={minute}
                onChange={setMinute}
                formatLabel={(value) => String(value).padStart(2, '0')}
              />
            </View>

            <Button
              label="선택 완료"
              onPress={handleConfirm}
              style={[styles.confirmButton, styles.pillButton]}
            />

            <Pressable onPress={handleClear} hitSlop={8} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>선택 안 함</Text>
            </Pressable>
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
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WHEEL_HEIGHT,
    marginTop: spacing.md,
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * PADDING_COUNT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}14`,
  },
  wheelColumn: {
    flex: 1,
  },
  periodColumn: {
    flex: 0.7,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  wheelItemTextSelected: {
    ...typography.heading3,
    fontWeight: '700',
  },
  colon: {
    ...typography.heading2,
    color: colors.text.primary,
    marginHorizontal: spacing.xs,
  },
  confirmButton: {
    marginTop: spacing.md,
  },
  pillButton: {
    borderRadius: borderRadius.full,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  clearButtonText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
