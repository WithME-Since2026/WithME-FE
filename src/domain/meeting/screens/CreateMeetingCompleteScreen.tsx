import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';

type CreateMeetingCompleteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateMeetingComplete'
>;

export function CreateMeetingCompleteScreen({
  route,
  navigation,
}: CreateMeetingCompleteScreenProps) {
  const { meetingId, title, inviteLink } = route.params;

  const handleCopyLink = () => {
    Clipboard.setStringAsync(inviteLink);
  };

  const handleGoToMeeting = () => {
    navigation.replace('MeetingDetail', { meetingId });
  };

  const handleKakaoShare = () => {
    // TODO: 카카오 SDK 연동 후 실제 공유 시트 연결
  };

  const handleBackToHome = () => {
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={colors.meeting.stepCompleted} />
        </View>

        <Text style={styles.title}>모임이 만들어졌어요!</Text>
        <Text style={styles.subtitle}>{title}</Text>

        <View style={styles.inviteLinkCard}>
          <View style={styles.inviteLinkTextGroup}>
            <Text style={styles.inviteLinkLabel}>초대 링크</Text>
            <Text style={styles.inviteLinkValue}>{inviteLink}</Text>
          </View>
          <Pressable style={styles.copyButton} onPress={handleCopyLink}>
            <Text style={styles.copyButtonLabel}>복사</Text>
          </Pressable>
        </View>

        <Button label="모임 바로가기" onPress={handleGoToMeeting} style={styles.primaryButton} />

        <Button
          label="카카오로 공유하기"
          variant="kakao"
          icon={<KakaoIcon />}
          onPress={handleKakaoShare}
        />

        <Pressable style={styles.homeLink} onPress={handleBackToHome} hitSlop={8}>
          <Text style={styles.homeLinkLabel}>홈으로 돌아가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.meeting.statusAttendingBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading3,
    color: colors.meeting.strongText,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body2,
    color: colors.meeting.mutedText,
    marginTop: spacing.xs,
  },
  inviteLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  inviteLinkTextGroup: {
    gap: 2,
  },
  inviteLinkLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  inviteLinkValue: {
    ...typography.caption,
    color: colors.meeting.strongText,
  },
  copyButton: {
    backgroundColor: colors.meeting.badgeBackground,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  copyButtonLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  primaryButton: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    backgroundColor: colors.meeting.primary,
  },
  homeLink: {
    marginTop: spacing.lg,
  },
  homeLinkLabel: {
    ...typography.body2,
    color: colors.meeting.mutedText,
  },
});
