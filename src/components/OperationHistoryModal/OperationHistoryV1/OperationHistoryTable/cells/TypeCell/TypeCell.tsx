import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import capitalize from 'lodash/capitalize';
import { FC } from 'react';

export interface TypeCellProps {
  readonly type: string;
}

export const TypeCell: FC<TypeCellProps> = ({ type }) => (
  <Flex justify="flex-start">
    <Box inline padding={[0, 2]} borderRadius="s">
      <Typography.Body size="small">{capitalize(type)}</Typography.Body>
    </Box>
  </Flex>
);
