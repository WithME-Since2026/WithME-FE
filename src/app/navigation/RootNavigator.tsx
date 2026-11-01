import { useEffect } from 'react';

import {
  NavigationContainer,
  type NavigatorScreenParams,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setOnSessionExpired } from '@/common/api/apiClient';

import { MainTabNavigator, type MainTabParamList } from './MainTabNavigator';


import { FindAccountScreen } from '@/domain/auth/screens/FindAccountScreen';
import { FindIdResultScreen } from '@/domain/auth/screens/FindIdResultScreen';
import { LoginScreen } from '@/domain/auth/screens/LoginScreen';
import { NameInputScreen } from '@/domain/auth/screens/NameInputScreen';
import { ResetPasswordScreen } from '@/domain/auth/screens/ResetPasswordScreen';
import { SignUpScreen } from '@/domain/auth/screens/SignUpScreen';
import { StartScreen } from '@/domain/auth/screens/StartScreen';
import { useAuthStore } from '@/domain/auth/store/authStore';
import type { SignUpRequest } from '@/domain/auth/types';
import { CalendarScreen } from '@/domain/calendar/screens/CalendarScreen';
import { CreateMeetingCompleteScreen } from '@/domain/meeting/screens/CreateMeetingCompleteScreen';
import { CreateMeetingScreen } from '@/domain/meeting/screens/CreateMeetingScreen';
import { MeetingDetailScreen } from '@/domain/meeting/screens/MeetingDetailScreen';
import { NotificationSettingsScreen } from '@/domain/mypage/screens/NotificationSettingsScreen';
import { ProfileEditScreen } from '@/domain/mypage/screens/ProfileEditScreen';
import { WithdrawCompleteScreen } from '@/domain/mypage/screens/WithdrawCompleteScreen';
import { WithdrawConfirmScreen } from '@/domain/mypage/screens/WithdrawConfirmScreen';
import { WithdrawReasonScreen } from '@/domain/mypage/screens/WithdrawReasonScreen';
import { WithdrawScreen } from '@/domain/mypage/screens/WithdrawScreen';
import { NotificationScreen } from '@/domain/notification/screens/NotificationScreen';
import { OnboardingScreen } from '@/domain/onboarding/screens/OnboardingScreen';
import { PaymentCompleteScreen } from '@/domain/subscription/screens/PaymentCompleteScreen';
import { PaymentMethodScreen } from '@/domain/subscription/screens/PaymentMethodScreen';
import { SubscriptionScreen } from '@/domain/subscription/screens/SubscriptionScreen';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
  // 회원가입 폼 입력값을 들고 이름 입력 화면으로 넘어가 nickname과 함께 가입 API 호출
  NameInput: { signUpRequest: Omit<SignUpRequest, 'nickname'> };
  FindAccount: { initialTab?: 'ID' | 'PASSWORD' } | undefined;
  FindIdResult: { loginId: string };
  ResetPassword: { loginId: string; email: string; code: string };
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  MeetingDetail: { meetingId: number };
  CreateMeeting: undefined;
  CreateMeetingComplete: { meetingId: number; title: string; inviteLink: string };
  Calendar: undefined;
  Notification: undefined;
  ProfileEdit: undefined;
  NotificationSettings: undefined;
  Withdraw: undefined;
  WithdrawReason: undefined;
  WithdrawConfirm: { reason?: string; detail?: string } | undefined;
  WithdrawComplete: undefined;
  Subscription: undefined;
  PaymentMethod: undefined;
  PaymentComplete: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

type RootNavigatorProps = {
  initialRouteName: 'Start' | 'Main';
};

export function RootNavigator({ initialRouteName }: RootNavigatorProps) {
  // 토큰 재발급까지 실패하면 로그인 상태를 해제하고 시작 화면으로 되돌림
  useEffect(() => {
    setOnSessionExpired(() => {
      useAuthStore.getState().clearAuth();
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: 'Start' }] });
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* 시작/로그인 화면 모두 기본 헤더 없는 풀스크린 디자인 */}
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="FindAccount" component={FindAccountScreen} />
        <Stack.Screen name="FindIdResult" component={FindIdResultScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
        <Stack.Screen
          name="CreateMeeting"
          component={CreateMeetingScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="CreateMeetingComplete" component={CreateMeetingCompleteScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} />
        <Stack.Screen name="WithdrawReason" component={WithdrawReasonScreen} />
        <Stack.Screen name="WithdrawConfirm" component={WithdrawConfirmScreen} />
        <Stack.Screen name="WithdrawComplete" component={WithdrawCompleteScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentComplete" component={PaymentCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
