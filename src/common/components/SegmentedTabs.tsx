import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

type SegmentedTabsProps<T extends string> = {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

// 계정 찾기 화면의 "아이디 찾기" / "비밀번호 찾기" 같은 밑줄 강조형 탭 전환에 사용하는 공용 컴포넌트
export function SegmentedTabs<T extends string>({ tabs, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    // 부모의 borderBottom 위에 겹쳐 그려 활성 탭만 밑줄이 도드라져 보이게 함
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  label: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.disabled,
  },
  labelActive: {
    color: colors.primary,
  },
});
