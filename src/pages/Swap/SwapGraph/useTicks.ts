import { DateTime, Duration, DurationLike } from 'luxon';
import { DependencyList, useMemo } from 'react';

const getTicksArray = (
  tick: DurationLike,
  durationOffset: DurationLike,
): DateTime[] => {
  const now = DateTime.now();
  const tickMillis = Duration.fromDurationLike(tick).toMillis();
  const preLastOffset = now.plus({ minute: now.offset }).valueOf() % tickMillis;
  const preLast = now.minus({ millisecond: preLastOffset });

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
  deps: DependencyList,
): DateTime[] => useMemo(() => getTicksArray(tick, durationOffset), deps);
