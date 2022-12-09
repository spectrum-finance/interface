import { Flex, Switch, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

export interface MyFarmsFilterProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export const MyFarmsFilter: FC<MyFarmsFilterProps> = ({ value, onChange }) => (
  <Flex>
    <Flex.Item marginRight={2}>
      <Switch checked={value} onChange={onChange} />
    </Flex.Item>
    <Typography.Body size="large" strong>
      My farms
    </Typography.Body>
  </Flex>
);
