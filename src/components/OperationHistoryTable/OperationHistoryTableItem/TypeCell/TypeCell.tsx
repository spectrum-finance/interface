import capitalize from 'lodash/capitalize';
import React, { FC } from 'react';

import { Box, Flex, Typography } from '../../../../ergodex-cdk';

export interface TypeCellProps {
  readonly type: string;
}

export const TypeCell: FC<TypeCellProps> = ({ type }) => (
  <Flex justify="flex-start">
    <Box inline padding={[0, 2]}>
      <Typography.Body>{capitalize(type)}</Typography.Body>
    </Box>
  </Flex>
);
