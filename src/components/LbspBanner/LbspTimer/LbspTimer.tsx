import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { DateTime, Interval } from 'luxon';
import { FC, useEffect, useState } from 'react';
import FlipNumbers from 'react-flip-numbers';

const LbspFinishDateTime = DateTime.utc(2024, 2, 4, 18, 44);

interface TimerItemProps {
  numbers: number;
  definition: string;
}
const TimerItem: FC<TimerItemProps> = ({ numbers, definition }) => {
  return (
    <Box padding={[2, 2, 1, 2]} secondary borderRadius="l">
      <Flex col align="center">
        <FlipNumbers
          numbers={String(
            numbers.toString().length >= 2 ? numbers : `0${numbers}`,
          )}
          play
          color="#ffffff"
          perspective={100}
          height={16}
          width={13}
        />
        <Typography.Body size="small" secondary>
          {definition}
        </Typography.Body>
      </Flex>
    </Box>
  );
};

export const LbspTimer = () => {
  const [duration, setDuration] = useState(
    Interval.fromDateTimes(DateTime.now(), LbspFinishDateTime).end.diff(
      DateTime.now(),
      ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],
    ),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(
        Interval.fromDateTimes(DateTime.now(), LbspFinishDateTime).end.diff(
          DateTime.now(),
          ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],
        ),
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex align="center">
      <Flex.Item marginRight={4}>
        <Typography.Title level={3}>Ends in: </Typography.Title>
      </Flex.Item>
      <Flex align="center" gap={2}>
        <TimerItem definition="Days" numbers={duration.days} />
        <TimerItem definition="Hours" numbers={duration.hours} />
        <TimerItem definition="Minutes" numbers={duration.minutes} />
        <TimerItem definition="Seconds" numbers={duration.seconds} />
      </Flex>
    </Flex>
  );
};
