import type { GestureResponderEvent } from 'react-native';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import { CALENDAR_LAYERS } from '@/domain/calendar/constants/calendarLayers';
import type { CalendarLayerKey } from '@/domain/calendar/types';

type CalendarLayerModalProps = {
  visible: boolean;
  enabledLayers: Record<CalendarLayerKey, boolean>;
  onToggleLayer: (key: CalendarLayerKey) => void;
  onClose: () => void;
};

// 레이어 토글 버튼 아래에 고정으로 뜨는 "레이어 설정" 팝업. 항목을 끄면 캘린더의 점 표시가 숨겨짐
export function CalendarLayerModal({
  visible,
  enabledLayers,
  onToggleLayer,
  onClose,
}: CalendarLayerModalProps) {
  const stopPropagation = (event: GestureResponderEvent) => {
    event.stopPropagation();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={stopPropagation}>
          <View style={styles.header}>
            <Text style={styles.title}>레이어 설정</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.doneText}>완료</Text>
            </Pressable>
          </View>

          {CALENDAR_LAYERS.map((layer, index) => (
            <View
              key={layer.key}
              style={[styles.row, index === CALENDAR_LAYERS.length - 1 && styles.rowLast]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.dot, { backgroundColor: layer.dotColor }]} />
                <View>
                  <Text style={[styles.label, layer.disabled && styles.labelDisabled]}>
                    {layer.label}
                  </Text>
                  <Text style={styles.description}>{layer.description}</Text>
                </View>
              </View>
              <Switch
                value={enabledLayers[layer.key]}
                onValueChange={() => onToggleLayer(layer.key)}
                disabled={layer.disabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          ))}

          <Text style={styles.hint}>레이어를 끄면 해당 항목이 캘린더에서 숨겨집니다</Text>
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
    paddingTop: spacing.xxl * 2.5,
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
    marginBottom: spacing.xs,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  label: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.text.disabled,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  hint: {
    ...typography.caption,
    color: colors.text.disabled,
    marginTop: spacing.sm,
  },
});
