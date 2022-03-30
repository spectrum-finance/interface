import React, { FC } from 'react';

import { Flex } from '../../../../../ergodex-cdk';

export const DateTime: FC = () => (
  <Flex col>
    <Flex.Item marginBottom={1}>22 Nov, 21</Flex.Item>
    <Flex.Item>13:20</Flex.Item>
  </Flex>
);
