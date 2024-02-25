import { useState } from 'react';
import styled from 'styled-components';

import { TimeRangePicker, TimeType } from './TimeRangePicker';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const RightSideCoinList = () => {
  const [selectedTime, setSelectedTime] = useState<TimeType>('1w');
  return (
    <Container>
      <TimeRangePicker
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    </Container>
  );
};
