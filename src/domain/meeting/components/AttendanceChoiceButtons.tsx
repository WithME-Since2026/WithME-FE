import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MyAttendanceStatus } from '@/domain/meeting/types';

type AttendanceChoiceButtonsProps = {
  value: MyAttendanceStatus | null;
  onChange: (value: MyAttendanceStatus) => void;
};

const CHOICES: { value: MyAttendanceStatus; label: string }[] = [
  { value: 'ATTENDING', label: '✓  참석' },
  { value: 'NOT_ATTENDING', label: '×  불참' },
  { value: 'UNDECIDED', label: '미결정' },
];

export function AttendanceChoiceButtons({ value, onChange }: AttendanceChoiceButtonsProps) {
  return (
    <View style={styles.row}>
      {CHOICES.map((choice) => {
        const isSelected = value === choice.value;

        return (
          <Pressable
            key={choice.value}
            style={[styles.button, isSelected ? styles.buttonSelected : styles.buttonOutline]}
            onPress={() => onChange(choice.value)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{choice.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.meeting.primary,
  },
  buttonOutline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.meeting.outlineBorder,
  },
  label: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.meeting.mutedText,
  },
  labelSelected: {
    color: colors.background,
    fontWeight: '700',
  },
});
