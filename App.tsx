import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { AppProviders } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';

export default function App() {
  // Ionicons 폰트가 등록되기 전에 렌더링되면 아이콘 자리만 비어보이는 문제가 있어 로딩 완료까지 대기
  const [iconsLoaded] = useFonts({ ...Ionicons.font });

  if (!iconsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
