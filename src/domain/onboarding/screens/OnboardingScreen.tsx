import { useRef, useState } from 'react';

import {
  Image,
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
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';
import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';

// TODO: 3번째 페이지 일러스트는 아직 준비되지 않아 일단 비워둠. 시안 나오면 image 추가
const ONBOARDING_PAGES = [
  {
    key: 'schedule',
    image: onboarding1,
    title: '일정 바뀌면 자동으로\n참석 여부를 다시 확인해요',
    description:
      '운영자가 날짜나 장소를 변경하면\n기존 참석자에게 자동으로 재확인을 보내드려요.\n번거로운 단체 카톡, 이제 안녕!',
  },
  {
    key: 'link',
    image: onboarding2,
    title: '링크 하나로\n앱 없이도 참여할 수 있어요',
    description: '모임 링크를 공유하면 상대방은 앱 설치 없이\n웹으로 참석 여부를 답할 수 있어요.',
  },
  {
    key: 'todo',
    image: undefined,
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
            <View style={styles.skipRow}>
              {index !== LAST_PAGE_INDEX && (
                <Pressable onPress={handleFinish} hitSlop={8}>
                  <Text style={styles.skipText}>건너뛰기</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.illustrationContainer}>
              {page.image && (
                <Image source={page.image} style={styles.illustration} resizeMode="contain" />
              )}
            </View>

            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {/* TODO: 온보딩 종료 후 이동 플로우 확정 전까지 임시로 비활성화 */}
        {isLastPage && <Button label="시작하기" onPress={handleFinish} disabled />}

        <View style={styles.dots}>
          {ONBOARDING_PAGES.map((page, index) => (
            <View key={page.key} style={[styles.dot, index === activeIndex && styles.dotActive]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pager: {
    flex: 1,
  },
  page: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 24,
    marginBottom: spacing.md,
  },
  skipText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  illustrationContainer: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  illustration: {
    width: '95%',
    height: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
  },
  description: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
});
