import { Box, Control, Input, Select } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { LabeledContent } from '../../../../../components/LabeledContent/LabeledContent';

const StyledInput = styled(Input)`
  .ant-input-group-addon {
    background: var(--spectrum-select-group-background);
  }

  &:not(.ant-select-disabled) .ant-select-selector:hover {
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

export enum IntervalType {
  BLOCK,
  HOUR,
  DAY,
  WEEK,
  MONTH,
}

export const FarmDistributionIntervalInput: FC<
  Control<{ type: IntervalType; value: number } | undefined>
> = ({ value, onChange }) => {
  const [type, setType] = useState<IntervalType>(IntervalType.BLOCK);

  useEffect(() => {
    handleChange(value?.value);
  }, [type]);

  const handleChange = (value: number | undefined) => {
    if (!onChange) {
      return;
    }
    if (value) {
      onChange({ type, value });
    } else {
      onChange(undefined);
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
          value={value?.value}
          onChange={(e) => handleChange(e.target.valueAsNumber)}
          name="distributionInterval"
          addonAfter={
            <Select value={type} onChange={setType}>
              <Select.Option value={IntervalType.BLOCK}>
                <Trans>Block</Trans>
              </Select.Option>
              <Select.Option value={IntervalType.HOUR}>
                <Trans>Hour</Trans>
              </Select.Option>
              <Select.Option value={IntervalType.DAY}>
                <Trans>Day</Trans>
              </Select.Option>
              <Select.Option value={IntervalType.WEEK}>
                <Trans>Week</Trans>
              </Select.Option>
              <Select.Option value={IntervalType.MONTH}>
                <Trans>Month</Trans>
              </Select.Option>
            </Select>
          }
        />
      </Box>
    </LabeledContent>
  );
};
