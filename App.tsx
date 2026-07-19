import { AppProviders } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
