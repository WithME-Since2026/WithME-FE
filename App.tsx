import { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { useFonts } from 'expo-font';

import { tokenManager } from '@/common/api/tokenManager';
import { LoadingView } from '@/common/components/LoadingView';

import { RootNavigator } from '@/app/navigation';
import { AppProviders } from '@/app/providers';

import { useAuthStore } from '@/domain/auth/store/authStore';

export default function App() {
  // Ionicons 폰트가 등록되기 전에 렌더링되면 아이콘 자리만 비어보이는 문제가 있어 로딩 완료까지 대기
  const [fontsLoaded] = useFonts({ FredokaOne_400Regular, ...Ionicons.font });
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // 저장된 토큰이 있으면 로그인 상태 복원. 액세스 토큰이 만료됐어도 첫 API 401에서 재발급됨
  useEffect(() => {
    tokenManager.getRefreshToken().then((token) => {
      if (token) {
        useAuthStore.getState().setAuth();
      }
      setHasToken(!!token);
    });
  }, []);

  if (!fontsLoaded || hasToken === null) {
    return <LoadingView />;
  }

  return (
    <AppProviders>
      <RootNavigator initialRouteName={hasToken ? 'Main' : 'Start'} />
    </AppProviders>
  );
}
