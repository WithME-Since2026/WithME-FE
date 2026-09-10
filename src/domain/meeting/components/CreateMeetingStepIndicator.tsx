import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '@/common/styles/theme';

type CreateMeetingStepIndicatorProps = {
  currentStep: 1 | 2 | 3;
};

const STEPS: { step: 1 | 2 | 3; label: string }[] = [
  { step: 1, label: '기본정보' },
  { step: 2, label: '날짜·장소' },
  { step: 3, label: '참석확인' },
];

export function CreateMeetingStepIndicator({ currentStep }: CreateMeetingStepIndicatorProps) {
  return (
    <View style={styles.row}>
      {STEPS.map((item, index) => {
        const isCompleted = item.step < currentStep;
        const isCurrent = item.step === currentStep;
        const leftConnectorActive = index > 0 && STEPS[index - 1].step < currentStep;
        const rightConnectorActive = index < STEPS.length - 1 && item.step < currentStep;

        return (
          <View key={item.step} style={styles.stepColumn}>
            <View style={styles.connectorRow}>
              <View
                style={[styles.connector, index === 0 && styles.connectorHidden, leftConnectorActive && styles.connectorActive]}
              />
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={colors.background} />
                ) : (
                  <Text style={[styles.circleText, isCurrent && styles.circleTextCurrent]}>
                    {item.step}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.connector,
                  index === STEPS.length - 1 && styles.connectorHidden,
                  rightConnectorActive && styles.connectorActive,
                ]}
              />
            </View>

            <Text
              style={[
                styles.label,
                isCurrent && styles.labelCurrent,
                isCompleted && styles.labelCompleted,
              ]}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  stepColumn: {
    flex: 1,
    alignItems: 'center',
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.meeting.outlineBorder,
  },
  connectorHidden: {
    backgroundColor: 'transparent',
  },
  connectorActive: {
    backgroundColor: colors.meeting.stepCompleted,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.meeting.outlineBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: colors.meeting.stepCompleted,
    borderWidth: 0,
  },
  circleCurrent: {
    backgroundColor: colors.meeting.primary,
    borderWidth: 0,
  },
  circleText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.meeting.mutedText,
  },
  circleTextCurrent: {
    color: colors.background,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    color: colors.meeting.mutedText,
    marginTop: spacing.xs,
  },
  labelCurrent: {
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  labelCompleted: {
    color: colors.meeting.stepCompleted,
  },
});
