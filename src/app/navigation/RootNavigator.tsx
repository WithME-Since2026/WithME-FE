import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabNavigator } from './MainTabNavigator';

import { FindAccountScreen } from '@/domain/auth/screens/FindAccountScreen';
import { FindIdResultScreen } from '@/domain/auth/screens/FindIdResultScreen';
import { LoginScreen } from '@/domain/auth/screens/LoginScreen';
import { NameInputScreen } from '@/domain/auth/screens/NameInputScreen';
import { ResetPasswordScreen } from '@/domain/auth/screens/ResetPasswordScreen';
import { SignUpScreen } from '@/domain/auth/screens/SignUpScreen';
import { StartScreen } from '@/domain/auth/screens/StartScreen';
import { CalendarScreen } from '@/domain/calendar/screens/CalendarScreen';
import { CreateMeetingCompleteScreen } from '@/domain/meeting/screens/CreateMeetingCompleteScreen';
import { CreateMeetingScreen } from '@/domain/meeting/screens/CreateMeetingScreen';
import { MeetingDetailScreen } from '@/domain/meeting/screens/MeetingDetailScreen';
import { MyPageScreen } from '@/domain/mypage/screens/MyPageScreen';
import { NotificationSettingsScreen } from '@/domain/mypage/screens/NotificationSettingsScreen';
import { ProfileEditScreen } from '@/domain/mypage/screens/ProfileEditScreen';
import { NotificationScreen } from '@/domain/notification/screens/NotificationScreen';
import { OnboardingScreen } from '@/domain/onboarding/screens/OnboardingScreen';
import { PaymentCompleteScreen } from '@/domain/subscription/screens/PaymentCompleteScreen';
import { PaymentMethodScreen } from '@/domain/subscription/screens/PaymentMethodScreen';
import { SubscriptionScreen } from '@/domain/subscription/screens/SubscriptionScreen';

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  SignUp: undefined;
  NameInput: { nickname?: string } | undefined;
  FindAccount: { initialTab?: 'ID' | 'PASSWORD' } | undefined;
  FindIdResult: { loginId: string };
  ResetPassword: { loginId: string; email: string; code: string };
  Onboarding: undefined;
  Main: undefined;
  MeetingDetail: { meetingId: number };
  CreateMeeting: undefined;
  CreateMeetingComplete: { meetingId: number; title: string; inviteLink: string };
  Calendar: undefined;
  Notification: undefined;
  MyPage: undefined;
  ProfileEdit: undefined;
  NotificationSettings: undefined;
  Subscription: undefined;
  PaymentMethod: undefined;
  PaymentComplete: undefined;
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
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentComplete" component={PaymentCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
