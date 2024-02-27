import styled from 'styled-components';

const Container = styled('div')`
  padding: 2px;
  background: linear-gradient(
    129deg,
    rgba(69, 78, 96, 0.63) 11.81%,
    rgba(73, 79, 89, 0.63) 48.34%,
    rgba(43, 56, 74, 0.63) 98.82%
  );
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
`;

const TimeItem = styled('div')<{ isActive?: boolean }>`
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  color: var(--teddy-primary-text);
  font-weight: 600;

  cursor: pointer;
  ${(props) =>
    props.isActive &&
    `
     background: linear-gradient(
    315deg,
    #181d2d -11.92%,
    rgba(46, 47, 58, 0.75) 119.58%
  );
  `}
`;

const availableTimes = ['1h', '1d', '1w', '1m', '3m', '1y', 'All Time'];

export type TimeType = '1w' | '1d' | '1h' | '1m' | '3m' | '1y' | 'All Time';

type TimeRangePickerProps = {
  selectedTime: TimeType;
  setSelectedTime: (val: TimeType) => void;
};

export const TimeRangePicker = ({
  selectedTime,
  setSelectedTime,
}: TimeRangePickerProps) => {
  const updateSelectedTime = (val: TimeType) => {
    setSelectedTime(val);
  };

  return (
    <Container>
      {availableTimes.map((val) => (
        <TimeItem
          onClick={() => {
            updateSelectedTime(val as TimeType);
          }}
          isActive={val === selectedTime}
          key={val}
        >
          {val}
        </TimeItem>
      ))}
    </Container>
  );
};
