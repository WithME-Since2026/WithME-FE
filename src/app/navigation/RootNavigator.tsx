import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/domain/auth/screens/LoginScreen';
import { SignUpScreen } from '@/domain/auth/screens/SignUpScreen';
import { StartScreen } from '@/domain/auth/screens/StartScreen';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      {/* 시작/로그인 화면 모두 기본 헤더 없는 풀스크린 디자인 */}
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
