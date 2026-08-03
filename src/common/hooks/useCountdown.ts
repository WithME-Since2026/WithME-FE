import { useEffect, useState } from 'react';

// 인증번호 만료 타이머처럼 초 단위 카운트다운이 필요한 곳에서 공용으로 사용
export function useCountdown(durationSeconds: number) {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!expiresAt || remainingSeconds <= 0) {
      return;
    }

    // setInterval 대신 setTimeout을 재귀 호출해 언마운트/재시작 시 타이머 정리를 단순하게 유지.
    // prev - 1로 단순 감소시키면 setTimeout 지연이 누적돼 오차가 생기므로,
    // 매 tick마다 expiresAt 기준으로 남은 시간을 다시 계산
    const timerId = setTimeout(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearTimeout(timerId);
  }, [expiresAt, remainingSeconds]);

  const start = () => {
    setExpiresAt(Date.now() + durationSeconds * 1000);
    setRemainingSeconds(durationSeconds);
  };

  const reset = () => {
    setExpiresAt(null);
    setRemainingSeconds(0);
  };

  return {
    remainingSeconds,
    isRunning: remainingSeconds > 0,
    start,
    reset,
  };
}
