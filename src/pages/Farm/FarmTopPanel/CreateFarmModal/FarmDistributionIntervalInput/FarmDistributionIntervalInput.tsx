import { Box, Control, Input, Select } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import { LabeledContent } from '../../../../../components/LabeledContent/LabeledContent';

const StyledInput = styled(Input)`
  .ant-input-group-addon {
    background: transparent;
  }

  &:not(.ant-select-disabled) .ant-select-selector:hover {
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

export const FarmDistributionIntervalInput: FC<Control<number | undefined>> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.valueAsNumber);
    }
  };

  return (
    <LabeledContent label={t`Distribute tokens each`}>
      <Box padding={2} secondary borderRadius="l">
        <StyledInput
          size="large"
          type="number"
          inputMode="decimal"
          placeholder="Distribution interval"
          value={value}
          onChange={handleChange}
          addonAfter={
            <Select defaultValue="block">
              <Select.Option value="block">
                <Trans>Block</Trans>
              </Select.Option>
              <Select.Option value="hour">
                <Trans>Hour</Trans>
              </Select.Option>
              <Select.Option value="day">
                <Trans>Day</Trans>
              </Select.Option>
              <Select.Option value="week">
                <Trans>Week</Trans>
              </Select.Option>
              <Select.Option value="month">
                <Trans>Month</Trans>
              </Select.Option>
            </Select>
          }
        />
      </Box>
    </LabeledContent>
  );
};
