import { Box, Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { FarmAction } from '../../common/FarmAction/FarmAction';

export interface FarmActionCellProps {
  readonly farm: Farm;
}

export const FarmActionCell: FC<FarmActionCellProps> = ({ farm }) => (
  <Box width="100%" height="100%" transparent bordered={false} padding={[0, 4]}>
    <Flex col justify="center" stretch>
      <FarmAction size="large" farm={farm} fullWidth />
    </Flex>
  </Box>
);
