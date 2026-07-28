import { useRef, useState } from 'react';

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { DevResetLink } from '@/common/components/DevResetLink';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { LinkShareCard } from '@/domain/onboarding/components/LinkShareCard';
import { ScheduleReminderCard } from '@/domain/onboarding/components/ScheduleReminderCard';
import { TodoChecklistCard } from '@/domain/onboarding/components/TodoChecklistCard';

const ONBOARDING_PAGES = [
  {
    key: 'schedule',
    card: <ScheduleReminderCard />,
    title: '일정 바뀌면 자동으로\n참석 여부를 다시 확인해요',
    description:
      '운영자가 날짜나 장소를 변경하면\n기존 참석자에게 자동으로 재확인을 보내드려요.\n번거로운 단체 카톡, 이제 안녕!',
  },
  {
    key: 'link',
    card: <LinkShareCard />,
    title: '링크 하나로\n앱 없이 참여할 수 있어요',
    description: '모임 링크를 공유하면 상대방은 앱 설치 없이\n웹으로 참석 여부를 답할 수 있어요.',
  },
  {
    key: 'todo',
    card: <TodoChecklistCard />,
    title: 'Todo로 준비 완벽하게',
    description: '모임 준비 할 일을 Todo로 등록하고\n기한 안에 완료해 보세요.',
  },
];

const LAST_PAGE_INDEX = ONBOARDING_PAGES.length - 1;

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// 최초 회원가입 직후 보여주는 3페이지 기능 소개 온보딩 화면
export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastPage = activeIndex === LAST_PAGE_INDEX;

  const handleFinish = () => {
    navigation.replace('Login');
  };

  const handleNextPress = () => {
    if (isLastPage) {
      handleFinish();
      return;
    }

    const nextIndex = activeIndex + 1;
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setActiveIndex(nextIndex);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.pager}
      >
        {ONBOARDING_PAGES.map((page, index) => (
          <View key={page.key} style={[styles.page, { width }]}>
            {page.card}

            <View style={styles.dots}>
              {ONBOARDING_PAGES.map((dotPage, dotIndex) => (
                <View
                  key={dotPage.key}
                  style={[styles.dot, dotIndex === index && styles.dotActive]}
                />
              ))}
            </View>

            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button label={isLastPage ? '시작하기' : '다음'} onPress={handleNextPress} />
        {/* 마지막 페이지에서도 자리는 유지해 "시작하기" 버튼 위치가 흔들리지 않도록 opacity로만 숨김 */}
        <Pressable
          style={[styles.skipLink, isLastPage && styles.skipLinkHidden]}
          onPress={handleFinish}
          disabled={isLastPage}
          pointerEvents={isLastPage ? 'none' : 'auto'}
          hitSlop={8}
        >
          <Text style={styles.skipLinkText}>건너뛰기</Text>
        </Pressable>
        <DevResetLink navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  pager: {
    flex: 1,
  },
  page: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginTop: spacing.xl,
  },
  description: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  skipLink: {
    alignItems: 'center',
  },
  skipLinkHidden: {
    opacity: 0,
  },
  skipLinkText: {
    ...typography.caption,
    color: colors.text.disabled,
  },
});
