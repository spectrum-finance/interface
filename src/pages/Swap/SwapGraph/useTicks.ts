import { DateTime, Duration, DurationLike } from 'luxon';
import { DependencyList, useMemo } from 'react';

const getTicksArray = (
  tick: DurationLike,
  durationOffset: DurationLike,
  preLastFromNow: (d: DateTime) => DateTime,
): DateTime[] => {
  const now = DateTime.now();
  const tickMillis = Duration.fromDurationLike(tick).toMillis();
  const preLast = preLastFromNow(now);

  now.minus(tick);
  return Array(
    Math.floor(now.diff(now.minus(durationOffset)).toMillis() / tickMillis),
  )
    .fill(undefined)
    .map((_, i) =>
      preLast.minus({
        millisecond: tickMillis * i,
      }),
    )
    .reverse();
};

export const useTicks = (
  tick: DurationLike,
  durationOffset: DurationLike,
  preLastFromNow: (d: DateTime) => DateTime,
  deps: DependencyList,
): DateTime[] =>
  useMemo(() => getTicksArray(tick, durationOffset, preLastFromNow), deps);
