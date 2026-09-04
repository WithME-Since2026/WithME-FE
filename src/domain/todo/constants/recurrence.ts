import { parseDateKey } from '@/common/utils/date';

import type { TodoRecurrenceRule, TodoRecurrenceUnit } from '@/domain/todo/types';

const UNIT_LABELS: Record<TodoRecurrenceUnit, string> = {
  DAY: '일',
  WEEK: '주',
  MONTH: '개월',
};

// "매주"/"매월" 칩은 항상 due date의 요일을 기준으로 다음 규칙을 만든다
export function createWeeklyRecurrence(dueDateKey: string): TodoRecurrenceRule {
  return {
    frequency: 'WEEKLY',
    interval: 1,
    unit: 'WEEK',
    weekdays: [parseDateKey(dueDateKey).getDay()],
    end: { type: 'NEVER' },
  };
}

export function createMonthlyRecurrence(): TodoRecurrenceRule {
  return { frequency: 'MONTHLY', interval: 1, unit: 'MONTH', weekdays: [], end: { type: 'NEVER' } };
}

// "맞춤 반복" 시트를 처음 열 때 채워줄 기본값 (기존에 맞춤 규칙이 없을 때만 사용)
export function createDefaultCustomRecurrence(dueDateKey: string): TodoRecurrenceRule {
  return {
    frequency: 'CUSTOM',
    interval: 1,
    unit: 'WEEK',
    weekdays: [parseDateKey(dueDateKey).getDay()],
    end: { type: 'NEVER' },
  };
}

// "맞춤" 칩에 보여줄 요약 텍스트 (예: "매일", "2주마다", "3개월마다")
export function formatRecurrenceSummary(rule: TodoRecurrenceRule) {
  const unitLabel = UNIT_LABELS[rule.unit];

  return rule.interval <= 1 ? `매${unitLabel}` : `${rule.interval}${unitLabel}마다`;
}
