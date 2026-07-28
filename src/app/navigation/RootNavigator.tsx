import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FindAccountScreen } from '@/domain/auth/screens/FindAccountScreen';
import { FindIdResultScreen } from '@/domain/auth/screens/FindIdResultScreen';
import { LoginScreen } from '@/domain/auth/screens/LoginScreen';
import { NameInputScreen } from '@/domain/auth/screens/NameInputScreen';
import { ResetPasswordScreen } from '@/domain/auth/screens/ResetPasswordScreen';
import { SignUpScreen } from '@/domain/auth/screens/SignUpScreen';
import { StartScreen } from '@/domain/auth/screens/StartScreen';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
  NameInput: undefined;
  FindAccount: { initialTab?: 'ID' | 'PASSWORD' } | undefined;
  FindIdResult: { loginId: string };
  ResetPassword: { loginId: string; email: string; code: string };
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
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="FindAccount" component={FindAccountScreen} />
        <Stack.Screen name="FindIdResult" component={FindIdResultScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
