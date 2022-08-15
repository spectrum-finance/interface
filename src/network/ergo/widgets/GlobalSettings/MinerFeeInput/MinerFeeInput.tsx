import {
  Alert,
  Animation,
  Button,
  Control,
  Flex,
  Input,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { ChangeEvent, FC, useState } from 'react';

import { defaultMinerFee } from '../../../../../common/constants/settings';

export type MinerFeeInputProps = Control<number>;

export const MinerFeeInput: FC<MinerFeeInputProps> = ({
  value,
  onChange,
  state,
  message,
}) => {
  const [viewValue, setViewValue] = useState<string | undefined>(
    value?.toString(),
  );

  const handleMinimalBtnClick = () => onChange && onChange(defaultMinerFee);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.valueAsNumber);
      setViewValue(event.target.value);
    }
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={message ? 2 : 0}>
        <Flex>
          <Flex.Item marginRight={1}>
            <Button type="primary" size="large" onClick={handleMinimalBtnClick}>
              <Trans>Minimum</Trans>
            </Button>
          </Flex.Item>
          <Flex.Item flex={1}>
            <Input
              size="large"
              placeholder="> 0.002"
              type="number"
              value={viewValue}
              onChange={handleInputChange}
              state={state}
              autoCorrect="off"
              autoComplete="off"
              suffix="ERG"
            />
          </Flex.Item>
        </Flex>
      </Flex.Item>
      <Animation.Expand expanded={!!message}>
        <Alert showIcon type={state} message={message} />
      </Animation.Expand>
    </Flex>
  );
};
