import { DateTime } from 'luxon';
import React from 'react';

import { DatePicker, Flex } from '../../../../ergodex-cdk';

interface LockLiquidityDatePickerProps {
  value?: DateTime | null | undefined;
  onChange: (date: DateTime | null, dateString: string) => void;
}

const LockLiquidityDatePicker: React.FC<LockLiquidityDatePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <Flex align="center">
      <Flex.Item>Display data</Flex.Item>
      <Flex.Item>
        <DatePicker value={value} onChange={onChange} />
      </Flex.Item>
    </Flex>
  );
};

export { LockLiquidityDatePicker };
