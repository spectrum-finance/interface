import { DateTime, DurationLike } from 'luxon';

export type Period = 'D' | 'W' | 'M' | 'Y' | string;

export interface PeriodSetting {
  resolution: number;
  durationOffset: DurationLike;
  tick: DurationLike;
  preLastFromNow: (d: DateTime) => DateTime;
  timeFormat: Intl.DateTimeFormatOptions;
}

const PeriodSettings: Record<Period, PeriodSetting> = {
  D: {
    resolution: 1,
    durationOffset: { day: 1 },
    tick: { hour: 1 },
    preLastFromNow: (d: DateTime) => d.startOf('hour'),
    timeFormat: DateTime.TIME_SIMPLE,
  },
  W: {
    resolution: 1,
    durationOffset: { week: 1 },
    tick: { hour: 6 },
    preLastFromNow: (d: DateTime) => {
      if (d.hour < 12) {
        return d.startOf('day');
      } else {
        return d.set({
          minute: 0,
          second: 0,
          millisecond: 0,
          hour: 12,
        });
      }
    },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  M: {
    resolution: 1,
    durationOffset: { month: 1 },
    tick: { day: 1 },
    preLastFromNow: (d: DateTime) => d.startOf('day'),
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  Y: {
    resolution: 1,
    durationOffset: { year: 1 },
    tick: { day: 15 },
    preLastFromNow: (d: DateTime) => d.startOf('day'),
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
};
export const usePeriodSettings = (period: Period): PeriodSetting => {
  return PeriodSettings[period];
};
