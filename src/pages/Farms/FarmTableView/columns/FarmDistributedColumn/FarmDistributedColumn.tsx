import { Box, Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Farm } from '../../../../../common/models/Farm';
import { LineProgress } from './LineProgress/LineProgress';

export interface DistributedColumnProps {
  farm: Farm;
}

export const FarmDistributedColumn: FC<DistributedColumnProps> = ({ farm }) => (
  <Box transparent bordered={false}>
    <LineProgress percent={farm.distributed} height={24} width={160} />
  </Box>
);
