import { Ionicons } from '@expo/vector-icons';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { useFonts } from 'expo-font';

import { LoadingView } from '@/common/components/LoadingView';

import { RootNavigator } from '@/app/navigation';
import { AppProviders } from '@/app/providers';

export default function App() {
  // Ionicons 폰트가 등록되기 전에 렌더링되면 아이콘 자리만 비어보이는 문제가 있어 로딩 완료까지 대기
  const [fontsLoaded] = useFonts({ FredokaOne_400Regular, ...Ionicons.font });

  if (!fontsLoaded) {
    return <LoadingView />;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
