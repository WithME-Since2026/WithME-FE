import { StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyView } from '@/common/components/EmptyView';
import { colors } from '@/common/styles/theme';

// TODO: 마이페이지 디자인 확정 후 구현 (현재는 하단 탭 라우팅만 연결된 placeholder)
export function MyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <EmptyView message="마이페이지는 준비 중입니다." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
