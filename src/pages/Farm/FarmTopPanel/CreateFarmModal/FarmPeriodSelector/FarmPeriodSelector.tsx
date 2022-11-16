import {
  Box,
  Control,
  DatePicker,
  Flex,
  Input,
  SwapRightOutlined,
  Tabs,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';

import {
  blockToDateTime,
  dateTimeToBlock,
} from '../../../../../common/utils/blocks';
import { LabeledContent } from '../../../../../components/LabeledContent/LabeledContent';
import { PeriodType } from './PeriodType';

const PeriodTypeTab = styled(Tabs)`
  .ant-tabs-tab {
    padding: 0 1.5rem !important;
  }
`;

export interface FarmPeriodSelectorProps
  extends Control<[number | undefined, number | undefined] | undefined> {
  readonly networkHeight: number;
}

export const FarmPeriodSelector: FC<FarmPeriodSelectorProps> = ({
  value,
  onChange,
  networkHeight,
}) => {
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Date);

  const changePeriodType = (periodType: PeriodType): void => {
    setPeriodType(periodType);

    if ((!value || !value[0] || !value[1]) && onChange) {
      onChange(undefined);
    }
  };

  const handleStartBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange([e.target.valueAsNumber, value ? value[1] : undefined]);
    }
  };

  const handleEndBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange([value ? value[0] : undefined, e.target.valueAsNumber]);
    }
  };

  const handleRangeChange = (range: [DateTime, DateTime] | undefined) => {
    if (!onChange) {
      return;
    }
    if (range) {
      onChange([
        dateTimeToBlock(networkHeight, range[0]),
        dateTimeToBlock(networkHeight, range[1]),
      ]);
    } else {
      onChange(undefined);
    }
  };

  return (
    <LabeledContent
      label={t`Period`}
      extra={
        <PeriodTypeTab
          activeKey={periodType}
          onChange={changePeriodType as any}
          size="small"
        >
          <PeriodTypeTab.TabPane tab={t`Date`} key={PeriodType.Date} />
          <PeriodTypeTab.TabPane tab={t`Block`} key={PeriodType.Block} />
        </PeriodTypeTab>
      }
    >
      <Box padding={2} secondary borderRadius="l">
        {periodType === PeriodType.Block && (
          <Flex align="center">
            <Input
              placeholder={t`Start block`}
              type="number"
              inputMode="decimal"
              size="large"
              value={value ? value[0] : undefined}
              onChange={handleStartBlockChange}
            />
            <SwapRightOutlined
              style={{
                color: 'var(--spectrum-primary-text)',
                fontSize: 24,
              }}
            />
            <Input
              placeholder={t`End block`}
              type="number"
              inputMode="decimal"
              size="large"
              value={value ? value[1] : undefined}
              onChange={handleEndBlockChange}
            />
          </Flex>
        )}
        {periodType === PeriodType.Date && (
          <DatePicker.RangePicker
            size="large"
            value={
              value
                ? [
                    blockToDateTime(networkHeight, value[0]!),
                    blockToDateTime(networkHeight, value[1]!),
                  ]
                : undefined
            }
            onChange={handleRangeChange as any}
            className="w-full"
          />
        )}
      </Box>
    </LabeledContent>
  );
};
