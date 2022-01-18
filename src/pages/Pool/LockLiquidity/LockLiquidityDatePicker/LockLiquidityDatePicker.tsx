import './LockLiquidityDatePicker.less';

import { DateTime } from 'luxon';
import React from 'react';

import { DatePicker, Flex, Typography } from '../../../../ergodex-cdk';
import { getLockingPeriodString } from '../../utils';

interface LockLiquidityDatePickerProps {
  value?: DateTime | null | undefined;
  onChange: (value: DateTime | null | undefined) => void;
}

const LockLiquidityDatePicker: React.FC<LockLiquidityDatePickerProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (date: DateTime | null) => {
    onChange(date);
  };

  return (
    <Flex
      className="lock-liquidity-date-picker"
      align="center"
      justify="space-between"
    >
      <Flex.Item>
        {value ? (
          <Flex col>
            <Flex.Item marginBottom={1}>
              <Typography.Title level={5}>
                {value?.toLocaleString(DateTime.DATE_FULL)}
              </Typography.Title>
            </Flex.Item>
            <Flex.Item>
              <Typography.Body strong secondary>
                Lock period: {getLockingPeriodString(value)}
              </Typography.Body>
            </Flex.Item>
          </Flex>
        ) : (
          <Typography.Title level={5}>Choose date</Typography.Title>
        )}
      </Flex.Item>
      <Flex.Item>
        <DatePicker
          dropdownClassName="lock-liquidity-date-picker__dropdown"
          size="large"
          value={value}
          disabledDate={(current: DateTime) => {
            return current <= DateTime.now();
          }}
          onChange={handleChange}
          allowClear={false}
        />
      </Flex.Item>
    </Flex>
  );
};

export { LockLiquidityDatePicker };
