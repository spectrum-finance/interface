import './LockLiquidityDatePicker.less';

import { DateTime } from 'luxon';
import React from 'react';

import {
  Animation,
  DatePicker,
  Flex,
  Typography,
} from '../../../../ergodex-cdk';

interface LockLiquidityDatePickerProps {
  value?: DateTime | null | undefined;
  onChange: (value: DateTime | null | undefined) => void;
}

const getLockingPeriod = (date: DateTime): string => {
  const duration = date
    .endOf('day')
    .diffNow(['days', 'years', 'months', 'hours']);
  const yearsCount = duration.get('year');
  const monthsCount = duration.get('month');
  const daysCount = duration.get('day');

  const years = yearsCount === 1 ? `1 Year` : `${yearsCount} Years`;
  const months = monthsCount === 1 ? `1 Month` : `${monthsCount} Months`;
  const days = daysCount === 1 ? `1 Day` : `${daysCount} Days`;

  if (yearsCount && monthsCount && daysCount) {
    return `${years}, ${months} and ${days}`;
  }

  if (yearsCount && monthsCount && !daysCount) {
    return `${years}, ${months}`;
  }

  if (yearsCount && !monthsCount && daysCount) {
    return `${years}, ${days}`;
  }

  if (!yearsCount && monthsCount && daysCount) {
    return `${months}, ${days}`;
  }

  if (yearsCount && !monthsCount && !daysCount) {
    return `${years}`;
  }

  if (!yearsCount && monthsCount && !daysCount) {
    return `${months}`;
  }

  return days;
};

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
            <Animation.Expand expanded={!!value}>
              <Flex.Item marginBottom={1}>
                <Typography.Title level={5}>
                  {value?.toLocaleString(DateTime.DATE_FULL)}
                </Typography.Title>
              </Flex.Item>
              <Flex.Item>
                <Typography.Body strong secondary>
                  Lock period: {getLockingPeriod(value)}
                </Typography.Body>
              </Flex.Item>
            </Animation.Expand>
          </Flex>
        ) : (
          <Typography.Body strong secondary>
            Choose date
          </Typography.Body>
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
