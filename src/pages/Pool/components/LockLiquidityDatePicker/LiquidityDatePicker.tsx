import './LiquidityDatePicker.less';

import { DateTime } from 'luxon';
import React from 'react';

import { DatePicker, Flex, Typography } from '../../../../ergodex-cdk';
import { getLockingPeriodString } from '../../utils';

interface LockLiquidityDatePickerProps {
  selectedPrefix: string;
  value?: DateTime | null | undefined;
  defaultValue?: string;
  onChange: (value: DateTime | null | undefined) => void;
  disabledDate?: (c: DateTime) => boolean;
}

const LiquidityDatePicker: React.FC<LockLiquidityDatePickerProps> = ({
  value,
  defaultValue,
  onChange,
  disabledDate,
  selectedPrefix,
}) => {
  const handleChange = (date: DateTime | null) => {
    onChange(date);
  };

  return (
    <Flex
      className="liquidity-date-picker"
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
                {selectedPrefix}: {getLockingPeriodString(value)}
              </Typography.Body>
            </Flex.Item>
          </Flex>
        ) : (
          <Typography.Title
            style={{ color: 'var(--ergo-disabled-text-contrast)' }}
            level={5}
          >
            {defaultValue ? defaultValue : 'Choose Date'}
          </Typography.Title>
        )}
      </Flex.Item>
      <Flex.Item>
        <DatePicker
          dropdownClassName="liquidity-date-picker__dropdown"
          size="large"
          value={value}
          disabledDate={
            disabledDate
              ? disabledDate
              : (current: DateTime) => {
                  return current <= DateTime.now();
                }
          }
          onChange={handleChange}
          allowClear={false}
        />
      </Flex.Item>
    </Flex>
  );
};

export { LiquidityDatePicker };
