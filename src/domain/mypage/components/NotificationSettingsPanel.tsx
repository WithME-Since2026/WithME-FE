import { StyleSheet, Text, View } from 'react-native';

import { ToggleSwitch } from '@/common/components/ToggleSwitch';
import { colors, spacing, typography } from '@/common/styles/theme';

export type NotificationToggleKey = 'groupReminder' | 'todoDeadline' | 'newGroupInvite';

export type NotificationToggles = Record<NotificationToggleKey, boolean>;

// TODO: 카테고리별 알림 설정 API가 아직 없어(백엔드엔 notifyAgree 하나만 존재) 로컬 상태로만 관리.
// 카테고리별 API가 추가되면 useNotificationSettingsQuery 등 실제 값으로 교체할 것
export const INITIAL_NOTIFICATION_TOGGLES: NotificationToggles = {
  groupReminder: true,
  todoDeadline: true,
  newGroupInvite: false,
};

const TOGGLE_ITEMS: { key: NotificationToggleKey; label: string; hint: string }[] = [
  { key: 'groupReminder', label: '모임 리마인드 알림', hint: '모임 1시간 전 알림' },
  { key: 'todoDeadline', label: '할 일 마감 알림', hint: '마감 당일 오전 9시' },
  { key: 'newGroupInvite', label: '새 모임 초대 알림', hint: '초대받을 때 즉시' },
];

type NotificationSettingsPanelProps = {
  toggles: NotificationToggles;
  onToggle: (key: NotificationToggleKey) => void;
};

// 알림 설정 화면(NotificationSettingsScreen)의 "모임 알림" 카드에 들어가는 토글 목록
export function NotificationSettingsPanel({ toggles, onToggle }: NotificationSettingsPanelProps) {
  return (
    <View style={styles.container}>
      {TOGGLE_ITEMS.map((item, index) => (
        <View key={item.key} style={[styles.row, index > 0 && styles.rowDivider]}>
          <View style={styles.textGroup}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.hint}>{item.hint}</Text>
          </View>
          <ToggleSwitch value={toggles[item.key]} onValueChange={() => onToggle(item.key)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 4,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.notifDivider,
  },
  textGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.body2,
    fontSize: 15,
    color: colors.text.primary,
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
    color: colors.notifReadText,
    marginTop: 2,
  },
});
