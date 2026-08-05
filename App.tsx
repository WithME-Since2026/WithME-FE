import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { useFonts } from 'expo-font';

import { LoadingView } from '@/common/components/LoadingView';

import { RootNavigator } from '@/app/navigation';
import { AppProviders } from '@/app/providers';

export default function App() {
  const [fontsLoaded] = useFonts({ FredokaOne_400Regular });

  if (!fontsLoaded) {
    return <LoadingView />;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
