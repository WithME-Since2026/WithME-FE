import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type PaymentMethodScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentMethod'>;

// PG 결제 승인 + 서버 영수증 검증이 연동되기 전까지 결제 버튼을 막아 둠.
// 연동되면 true로 바꾸고, 승인/검증 성공 이후에만 프리미엄 활성화·완료 화면 이동을 처리할 것
const IS_PAYMENT_ENABLED = false;

// 프리미엄 구독 결제수단 등록 화면 (Figma node 311:2)
export function PaymentMethodScreen({ navigation }: PaymentMethodScreenProps) {
  // 카드 원본 값(번호/CVC/비밀번호 앞자리/생년월일)은 폼 검증(isFormComplete)에만 쓰입니다.
  // PG(카카오페이/토스페이먼츠 등) SDK 연동 전까지는 이 값들을 자체 백엔드로 전송하면 안 되며,
  // 실제 결제 연동 시에는 이 입력 폼 자체를 PG 위젯/SDK로 교체해 카드 데이터가 서버를 거치지 않게 해야 합니다.
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardPinPrefix, setCardPinPrefix] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [agreed, setAgreed] = useState(false);

  // 카드 입력 필드를 모두 채우고 약관에 동의해야만 결제 버튼 활성화
  const isFormComplete =
    cardNumber.trim() !== '' &&
    expiry.trim() !== '' &&
    cvc.trim() !== '' &&
    cardPinPrefix.trim() !== '' &&
    birthDate.trim() !== '' &&
    agreed;

  // 4자리씩 공백으로 묶어 "0000 0000 0000 0000" 형태로 표시
  const handleCardNumberChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 16);
    setCardNumber((digits.match(/.{1,4}/g) ?? []).join(' '));
  };

  // 앞 2자리 뒤에 "/"를 넣어 "MM/YY" 형태로 표시
  const handleExpiryChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  // TODO: 결제(PG) API가 아직 명세되지 않아 버튼이 비활성화된 상태(IS_PAYMENT_ENABLED).
  // 연동 시 PG 승인 + 서버 영수증 검증 결과를 받은 뒤에만 activatePremium() 호출 및
  // PaymentComplete 이동을 처리해야 함
  const handlePayPress = () => {};

  // TODO: 카카오페이 결제(PG) API가 아직 명세되지 않아 연동 전까지 자리만 만들어 둠
  const handleKakaoPayPress = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>결제수단 등록</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.planCard}>
          <View style={styles.planTextGroup}>
            <Text style={styles.planName}>WithME 프리미엄</Text>
            <Text style={styles.planDesc}>알림톡 구독·월간</Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeLabel}>PRO</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>결제 수단</Text>

        <Button
          label="카카오페이로 결제"
          variant="kakao"
          onPress={handleKakaoPayPress}
          style={styles.kakaoButton}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는 카드 직접 등록</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextField
          label="카드 번호"
          placeholder="0000 0000 0000 0000"
          keyboardType="number-pad"
          maxLength={19}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          containerStyle={styles.inputBox}
          labelStyle={styles.inputLabel}
        />

        <View style={styles.row}>
          <View style={styles.rowField}>
            <TextField
              label="유효기간"
              placeholder="MM/YY"
              keyboardType="number-pad"
              maxLength={5}
              value={expiry}
              onChangeText={handleExpiryChange}
              containerStyle={styles.inputBox}
              labelStyle={styles.inputLabel}
            />
          </View>
          <View style={styles.rowField}>
            <TextField
              label="CVC"
              keyboardType="number-pad"
              maxLength={3}
              secureEntry
              value={cvc}
              onChangeText={setCvc}
              containerStyle={styles.inputBox}
              labelStyle={styles.inputLabel}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <TextField
              label="카드 비밀번호 앞 2자리"
              keyboardType="number-pad"
              maxLength={2}
              secureEntry
              value={cardPinPrefix}
              onChangeText={setCardPinPrefix}
              containerStyle={styles.inputBox}
              labelStyle={styles.inputLabel}
            />
          </View>
          <View style={styles.rowField}>
            <TextField
              label="생년월일"
              placeholder="YYMMDD"
              keyboardType="number-pad"
              maxLength={6}
              value={birthDate}
              onChangeText={setBirthDate}
              containerStyle={styles.inputBox}
              labelStyle={styles.inputLabel}
            />
          </View>
        </View>

        <Pressable
          style={styles.agreementRow}
          onPress={() => setAgreed((prev) => !prev)}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <View style={[styles.agreementBox, agreed && styles.agreementBoxChecked]}>
            {agreed && <Ionicons name="checkmark-outline" size={13} color={colors.background} />}
          </View>
          <Text style={styles.agreementLabel}>
            <Text style={styles.agreementRequired}>[필수] </Text>
            정기결제 이용약관에 동의합니다
          </Text>
        </Pressable>

        <Button
          label="₩100 결제하고 시작하기"
          variant="primary"
          onPress={handlePayPress}
          disabled={!IS_PAYMENT_ENABLED || !isFormComplete}
          style={styles.payButton}
        />

        <Text style={styles.disclaimer}>첫 달 이후 매월 2,990원이 이 수단으로 자동 결제됩니다</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.premiumScreenBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.body1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.premiumCardBg,
    borderWidth: 1,
    borderColor: colors.premiumInputBorder,
    // Figma 실제 값 (rounded-12, height 62)
    borderRadius: 12,
    height: 62,
    paddingHorizontal: spacing.md,
  },
  planTextGroup: {
    gap: 2,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
    color: colors.text.primary,
  },
  planDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  proBadge: {
    // Figma node 312:28 실제 값
    paddingLeft: 5,
    paddingRight: 4,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.premiumTitleText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.premiumGold,
  },
  sectionLabel: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.text.primary,
    // Figma 실제 값: 상품 카드와의 간격 24px
    marginTop: spacing.lg,
  },
  kakaoButton: {
    marginTop: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.premiumInputBorder,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    // Figma 실제 값: 두 입력창 사이 간격 18px
    gap: 18,
  },
  rowField: {
    flex: 1,
  },
  inputBox: {
    // Figma 실제 값: 흰 배경 + 옅은 회갈색 테두리, radius 10, height 46
    backgroundColor: colors.background,
    borderColor: colors.premiumInputBorder,
    borderRadius: 10,
    height: 46,
  },
  inputLabel: {
    // Figma 실제 값
    fontSize: 12,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  agreementBox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.premiumInputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreementBoxChecked: {
    backgroundColor: colors.premiumTitleText,
    borderColor: colors.premiumTitleText,
  },
  agreementLabel: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.primary,
  },
  agreementRequired: {
    color: colors.text.secondary,
  },
  payButton: {
    // Figma 실제 값: 체크박스와의 간격 24px, 버튼 높이 54px
    marginTop: spacing.lg,
    height: 54,
  },
  disclaimer: {
    ...typography.caption,
    fontSize: 11,
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
