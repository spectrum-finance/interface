import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { DateTime, Duration, Interval } from 'luxon';
import { useEffect, useState } from 'react';
import FlipNumbers from 'react-flip-numbers';
import styled from 'styled-components';

import { applicationConfig } from '../../applicationConfig.ts';
import { isPreLbspTimeGap } from '../../utils/lbsp.ts';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip.tsx';

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

  @media (max-width: 960px) {
    & section {
      margin: 0 4px;
    }
    h4 {
      font-size: 14px !important;
    }
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 10px !important;
    }
  }
`;

export const LbspTimer = () => {
  const [timer, setTimer] = useState<Duration | undefined>();
  const { valBySize } = useDevice();

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
          <Flex align="center">
            <Trans>Swaps will be available in</Trans>
            <FlipNumbers
              numbers={String(
                timer.hours.toString().length === 2
                  ? timer.hours
                  : `0${timer.hours}`,
              )}
              play
              color="black"
              perspective={100}
              height={valBySize(10, 15, 20)}
              width={valBySize(10, 15, 20)}
            />
            <Trans>Hours</Trans>
            <FlipNumbers
              numbers={String(
                timer.minutes.toString().length === 2
                  ? timer.minutes
                  : `0${timer.minutes}`,
              )}
              play
              color="black"
              perspective={100}
              height={valBySize(10, 15, 20)}
              width={valBySize(10, 15, 20)}
            />{' '}
            <Trans>Minutes</Trans>
            <FlipNumbers
              numbers={String(
                timer.seconds.toString().length === 2
                  ? timer.seconds
                  : `0${timer.seconds}`,
              )}
              play
              color="black"
              perspective={100}
              height={valBySize(10, 15, 20)}
              width={valBySize(10, 15, 20)}
            />{' '}
            <Trans>Seconds</Trans>
            <InfoTooltip
              width={300}
              content={
                <Trans>
                  Swaps on smart contract level has been temporarily suspended
                  for 3 days to allow for deeper liquidity in the protocol and
                  prevent any unwanted changes in LBSP liquidity pool ratios.
                </Trans>
              }
              placement="top"
            />
          </Flex>
        </Typography.Title>
      )}
    </LbspTimerWrapper>
  );
};
