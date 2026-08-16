import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryProvider } from './QueryProvider';

type AppProvidersProps = {
  children: React.ReactNode;
};

// SafeAreaProvider가 없으면 각 화면의 SafeAreaView가 inset을 0으로 계산해
// 헤더가 노치/상태바에 가려짐 (Todo 화면 헤더가 화면 맨 위에 붙어 잘리던 원인)
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <QueryProvider>{children}</QueryProvider>
    </SafeAreaProvider>
  );
}
