import { DateTime, DurationLike } from 'luxon';

export type Period = 'D' | 'W' | 'M' | 'Y' | string;

export interface PeriodSetting {
  resolution: number;
  durationOffset: DurationLike;
  tick: DurationLike;
  timeFormat: Intl.DateTimeFormatOptions;
}

const PeriodSettings: Record<Period, PeriodSetting> = {
  D: {
    resolution: 1,
    durationOffset: { day: 1 },
    tick: { minute: 30 },
    timeFormat: DateTime.TIME_SIMPLE,
  },
  W: {
    resolution: 1,
    durationOffset: { week: 1 },
    tick: { hour: 3 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  M: {
    resolution: 1,
    durationOffset: { month: 1 },
    tick: { hour: 12 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  Y: {
    resolution: 1,
    durationOffset: { year: 1 },
    tick: { day: 7 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  TINY_D: {
    resolution: 1,
    durationOffset: { day: 1 },
    tick: { hour: 3 },
    timeFormat: DateTime.TIME_SIMPLE,
  },
};
export const usePeriodSettings = (period: Period): PeriodSetting => {
  return PeriodSettings[period];
};
