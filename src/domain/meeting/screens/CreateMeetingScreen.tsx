import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { CreateMeetingChipGroup } from '@/domain/meeting/components/CreateMeetingChipGroup';
import { CreateMeetingStepIndicator } from '@/domain/meeting/components/CreateMeetingStepIndicator';
import { CreateMeetingTextField } from '@/domain/meeting/components/CreateMeetingTextField';
import { InviteMemberRow } from '@/domain/meeting/components/InviteMemberRow';
import { useCreateMeetingMutation } from '@/domain/meeting/hooks/useCreateMeetingMutation';
import { useSearchContactsQuery } from '@/domain/meeting/hooks/useSearchContactsQuery';
import type {
  CreateMeetingBasicInfo,
  CreateMeetingScheduleInfo,
  InvitedMemberResponse,
  MeetingCategory,
  MeetingRepeatOption,
} from '@/domain/meeting/types';

const CATEGORY_OPTIONS: { value: MeetingCategory; label: string }[] = [
  { value: 'STUDY', label: '스터디' },
  { value: 'READING', label: '독서' },
  { value: 'EXERCISE', label: '운동' },
  { value: 'ETC', label: '기타' },
];

const REPEAT_OPTIONS: { value: MeetingRepeatOption; label: string }[] = [
  { value: 'NONE', label: '없음' },
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
  { value: 'CUSTOM', label: '직접설정' },
];

type Step = 1 | 2 | 3;

type CreateMeetingScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateMeeting'>;

export function CreateMeetingScreen({ navigation }: CreateMeetingScreenProps) {
  const [step, setStep] = useState<Step>(1);
  const [basicInfo, setBasicInfo] = useState<CreateMeetingBasicInfo>({
    title: '',
    description: '',
    category: 'STUDY',
    maxMemberCount: '',
  });
  const [scheduleInfo, setScheduleInfo] = useState<CreateMeetingScheduleInfo>({
    firstMeetingDate: '',
    startTime: '',
    endTime: '',
    location: '',
    repeatOption: 'NONE',
    repeatCount: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<InvitedMemberResponse[]>([]);

  const { data: searchResults } = useSearchContactsQuery(searchQuery);
  const { mutate: submitCreateMeeting, isPending } = useCreateMeetingMutation();

  const isStep1Valid = basicInfo.title.trim().length > 0;
  const isStep2Valid = scheduleInfo.firstMeetingDate.trim().length > 0;
  const isNextDisabled = (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || isPending;

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePrev = () => {
    if (step === 1) {
      navigation.goBack();
      return;
    }

    setStep((current) => (current - 1) as Step);
  };

  const handleNext = () => {
    if (step !== 3) {
      setStep((current) => (current + 1) as Step);
      return;
    }

    submitCreateMeeting(
      {
        ...basicInfo,
        ...scheduleInfo,
        invitedMemberIds: invitedMembers.map((member) => member.memberId),
      },
      {
        onSuccess: (result) => {
          navigation.replace('CreateMeetingComplete', {
            meetingId: result.meetingId,
            title: result.title,
            inviteLink: result.inviteLink,
          });
        },
      },
    );
  };

  const handleAddMember = (member: InvitedMemberResponse) => {
    setInvitedMembers((prev) =>
      prev.some((invited) => invited.memberId === member.memberId) ? prev : [...prev, member],
    );
  };

  const handleRemoveMember = (memberId: number) => {
    setInvitedMembers((prev) => prev.filter((member) => member.memberId !== memberId));
  };

  const invitedIds = new Set(invitedMembers.map((member) => member.memberId));
  const searchSuggestions = (searchResults ?? []).filter((contact) => !invitedIds.has(contact.memberId));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>새 모임 만들기</Text>
        <Pressable onPress={handleClose} hitSlop={8}>
          <Ionicons name="close" size={22} color={colors.meeting.mutedText} />
        </Pressable>
      </View>

      <View style={styles.stepIndicatorWrapper}>
        <CreateMeetingStepIndicator currentStep={step} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.fieldGroup}>
            <CreateMeetingTextField
              label="모임 이름"
              required
              placeholder="예: 화요일 독서모임"
              value={basicInfo.title}
              onChangeText={(title) => setBasicInfo((prev) => ({ ...prev, title }))}
            />
            <CreateMeetingTextField
              label="모임 설명"
              multiline
              placeholder="간단한 소개를 입력하세요"
              value={basicInfo.description}
              onChangeText={(description) => setBasicInfo((prev) => ({ ...prev, description }))}
            />
            <CreateMeetingChipGroup
              label="모임 유형"
              options={CATEGORY_OPTIONS}
              value={basicInfo.category}
              onChange={(category) => setBasicInfo((prev) => ({ ...prev, category }))}
            />
            <CreateMeetingTextField
              label="최대 인원"
              placeholder="예: 10명"
              keyboardType="number-pad"
              value={basicInfo.maxMemberCount}
              onChangeText={(maxMemberCount) =>
                setBasicInfo((prev) => ({ ...prev, maxMemberCount }))
              }
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.fieldGroup}>
            {/* TODO: 네이티브 날짜/시간 선택 UI는 별도 이슈에서 연결, 지금은 텍스트 직접 입력 */}
            <CreateMeetingTextField
              label="첫 모임 날짜"
              required
              placeholder="예: 2025년 7월 15일 (화)"
              value={scheduleInfo.firstMeetingDate}
              onChangeText={(firstMeetingDate) =>
                setScheduleInfo((prev) => ({ ...prev, firstMeetingDate }))
              }
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <CreateMeetingTextField
                  label="시작 시간"
                  placeholder="오후 7:00"
                  value={scheduleInfo.startTime}
                  onChangeText={(startTime) => setScheduleInfo((prev) => ({ ...prev, startTime }))}
                />
              </View>
              <View style={styles.rowItem}>
                <CreateMeetingTextField
                  label="종료 시간"
                  placeholder="오후 9:00"
                  value={scheduleInfo.endTime}
                  onChangeText={(endTime) => setScheduleInfo((prev) => ({ ...prev, endTime }))}
                />
              </View>
            </View>
            <CreateMeetingTextField
              label="장소"
              placeholder="예: 강남구 대학로 1"
              value={scheduleInfo.location}
              onChangeText={(location) => setScheduleInfo((prev) => ({ ...prev, location }))}
            />
            <CreateMeetingChipGroup
              label="반복"
              options={REPEAT_OPTIONS}
              value={scheduleInfo.repeatOption}
              onChange={(repeatOption) => setScheduleInfo((prev) => ({ ...prev, repeatOption }))}
            />
            <CreateMeetingTextField
              label="반복 횟수"
              placeholder="예: 10회"
              keyboardType="number-pad"
              value={scheduleInfo.repeatCount}
              onChangeText={(repeatCount) => setScheduleInfo((prev) => ({ ...prev, repeatCount }))}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.fieldGroup}>
            <View style={styles.inviteLinkCard}>
              <Text style={styles.inviteLinkLabel}>초대 링크</Text>
              <Text style={styles.inviteLinkValue}>withme.app/join/abc123</Text>
              <Text style={styles.inviteLinkHint}>링크로 초대하거나 직접 초대할 수 있어요</Text>
              <Pressable
                style={styles.copyButton}
                onPress={() => Clipboard.setStringAsync('withme.app/join/abc123')}
              >
                <Text style={styles.copyButtonLabel}>링크 복사</Text>
              </Pressable>
            </View>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={16} color={colors.meeting.mutedText} />
              <TextInput
                style={styles.searchInput}
                placeholder="이름 또는 연락처 검색"
                placeholderTextColor={colors.meeting.mutedText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {searchQuery.length > 0 && searchSuggestions.length > 0 && (
              <View style={styles.suggestionList}>
                {searchSuggestions.map((contact) => (
                  <Pressable
                    key={contact.memberId}
                    style={styles.suggestionRow}
                    onPress={() => handleAddMember(contact)}
                  >
                    <Text style={styles.suggestionName}>{contact.name}</Text>
                    <Text style={styles.suggestionPhone}>{contact.phoneLabel}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.invitedTitle}>초대된 멤버 ({invitedMembers.length}명)</Text>

            {invitedMembers.map((member, index) => (
              <InviteMemberRow
                key={member.memberId}
                member={member}
                avatarColorIndex={index}
                onRemove={() => handleRemoveMember(member.memberId)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.prevButton} onPress={handlePrev}>
          <Text style={styles.prevButtonLabel}>이전</Text>
        </Pressable>
        <Pressable
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          <Text style={styles.nextButtonLabel}>{step === 3 ? '완료' : '다음'}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.meeting.strongText,
  },
  stepIndicatorWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.meeting.outlineBorder,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  inviteLinkCard: {
    backgroundColor: colors.meeting.badgeBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 2,
  },
  inviteLinkLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  inviteLinkValue: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.strongText,
    marginTop: spacing.xs,
  },
  inviteLinkHint: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
  copyButton: {
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.meeting.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  copyButtonLabel: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.meeting.inputBorder,
    backgroundColor: colors.meeting.inputBackground,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body2,
    color: colors.meeting.strongText,
    padding: 0,
  },
  suggestionList: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.meeting.outlineBorder,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  suggestionName: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.meeting.strongText,
  },
  suggestionPhone: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
  invitedTitle: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.strongText,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  prevButton: {
    flex: 1,
    height: 50,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.meeting.stepNavPrevBorder,
    backgroundColor: colors.meeting.stepNavPrevBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButtonLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.stepNavPrevText,
  },
  nextButton: {
    flex: 1,
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.meeting.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.background,
  },
});
