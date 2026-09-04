import { useEffect } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

// 화면 하단에 잠깐 떴다 사라지는 공용 토스트 (Figma 784-23480). 별도 Modal로 띄우지 않고 호출한 화면의
// 레이아웃 안에 절대 위치로 렌더링해 "그 화면 위에 뜨는" 형태를 그대로 재현한다
type ToastProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  autoHideDurationMs?: number;
};

// 이 토스트(Figma 784-23480)만의 다크 톤 컬러. 앱 전역 theme에는 없어 로컬로 정의함
const TOAST_BG = '#313033';
const TOAST_TEXT = '#FFFFFF';
const TOAST_CLOSE_TEXT = '#DBE9FD';

export function Toast({ visible, message, onClose, autoHideDurationMs = 2500 }: ToastProps) {
  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(onClose, autoHideDurationMs);

    return () => clearTimeout(timer);
  }, [visible, autoHideDurationMs, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.toast}>
        <Text style={styles.message}>{message}</Text>
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
          <Text style={styles.closeLabel}>닫기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    // 화면 하단 탭바 자리(CalendarScreen의 paddingBottom: 64)보다 살짝 위, Figma 784-23480 기준
    bottom: 78,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TOAST_BG,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: TOAST_TEXT,
  },
  closeButton: {
    paddingLeft: 12,
  },
  closeLabel: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: TOAST_CLOSE_TEXT,
  },
});
