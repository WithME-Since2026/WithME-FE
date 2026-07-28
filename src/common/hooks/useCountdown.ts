import { useEffect, useState } from 'react';

// 인증번호 만료 타이머처럼 초 단위 카운트다운이 필요한 곳에서 공용으로 사용
export function useCountdown(durationSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    // setInterval 대신 setTimeout을 재귀 호출해 언마운트/재시작 시 타이머 정리를 단순하게 유지
    const timerId = setTimeout(() => setRemainingSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timerId);
  }, [remainingSeconds]);

  const start = () => setRemainingSeconds(durationSeconds);
  const reset = () => setRemainingSeconds(0);

  return {
    remainingSeconds,
    isRunning: remainingSeconds > 0,
    start,
    reset,
  };
}
