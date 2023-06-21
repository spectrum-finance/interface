import { Flex, Typography } from '@ergolabs/ui-kit';
import { DateTime, Duration, Interval } from 'luxon';
import { useEffect, useState } from 'react';
import FlipNumbers from 'react-flip-numbers';
import styled from 'styled-components';

import { applicationConfig } from '../../applicationConfig.ts';
import { isPreLbspTimeGap } from '../../utils/lbsp.ts';

const LbspTimerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 56px;
  margin-bottom: 56px;

  & section {
    margin: 0 8px;

    & span {
      color: var(--spectrum-primary-text) !important;
    }
  }

  & + main {
    padding-top: 0 !important;
  }
`;

export const LbspTimer = () => {
  const [timer, setTimer] = useState<Duration | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPreLbspTimeGap()) {
        setTimer(
          Interval.fromDateTimes(
            DateTime.now(),
            applicationConfig.cardanoAmmSwapsOpenTime,
          ).end.diff(DateTime.now(), [
            'hours',
            'minutes',
            'seconds',
            'milliseconds',
          ]),
        );
      } else {
        location.reload();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LbspTimerWrapper>
      {timer && (
        <Typography.Title level={4}>
          <Flex align="flex-start">
            Swaps will be available in
            <FlipNumbers
              numbers={String(
                timer.hours.toString().length === 2
                  ? timer.hours
                  : `0${timer.hours}`,
              )}
              play
              color="black"
              perspective={100}
              height={20}
              width={20}
            />
            Hours
            <FlipNumbers
              numbers={String(
                timer.minutes.toString().length === 2
                  ? timer.minutes
                  : `0${timer.minutes}`,
              )}
              play
              color="black"
              perspective={100}
              height={20}
              width={20}
            />{' '}
            Minutes
            <FlipNumbers
              numbers={String(
                timer.seconds.toString().length === 2
                  ? timer.seconds
                  : `0${timer.seconds}`,
              )}
              play
              color="black"
              perspective={100}
              height={20}
              width={20}
            />{' '}
            Seconds
          </Flex>
        </Typography.Title>
      )}
    </LbspTimerWrapper>
  );
};
