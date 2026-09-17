export const WEEKDAY_LABELS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export type CalendarCell = {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
};

// 'YYYY-MM-DD' 형태의 날짜 키 (배지/이벤트 매칭용)
export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateKey(date: Date) {
  return toDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

// 'YYYY-MM-DD' → 로컬 Date (new Date(string) 사용 시 UTC로 해석되는 문제 방지)
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function isSameDateKey(a: Date, b: Date) {
  return formatDateKey(a) === formatDateKey(b);
}

// 일요일 시작 6주(42칸) 그리드. 앞뒤 여백은 인접 달 날짜로 채워 매핑 계산을 단순화함
export function getMonthGrid(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  // getDay(): 일요일=0 ~ 토요일=6, 일요일 시작 기준과 그대로 일치
  const leadingOffset = firstDayOfMonth.getDay();

  const gridStart = new Date(year, month - 1, 1 - leadingOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === month - 1,
    };
  });
}

export function formatMonthLabel(year: number, month: number) {
  return `${year}년 ${month}월`;
}

export function formatDayDetailLabel(date: Date) {
  const weekday = WEEKDAY_LABELS_KO[date.getDay()];
  const label = `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;

  return isSameDateKey(date, new Date()) ? `${label} 오늘` : label;
}

// 알림 목록 등에서 쓰는 상대 시간 표기 ('방금', 'N분 전', 'N시간 전', '어제', 'M월 D일')
export function formatRelativeTimeKo(isoDateTime: string) {
  const target = new Date(isoDateTime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - target.getTime()) / (60 * 1000));

  if (diffMinutes < 1) {
    return '방금';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  if (isSameDateKey(target, now)) {
    return `${Math.floor(diffMinutes / 60)}시간 전`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDateKey(target, yesterday)) {
    return '어제';
  }

  return `${target.getMonth() + 1}월 ${target.getDate()}일`;
}
