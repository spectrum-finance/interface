import {
  Box,
  Flex,
  Progress,
  SwapRightOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';

export interface LivePeriodCellProps {
  readonly farm: Farm;
}

export const LivePeriodCell: FC<LivePeriodCellProps> = ({ farm }) => (
  <Box width="100%" height="100%" transparent bordered={false} padding={[0, 4]}>
    <Flex col justify="center" stretch>
      <Typography.Body secondary size="small">
        <Trans>Live Period</Trans>
      </Typography.Body>
      <Typography.Body>
        {farm.startDateTime.toFormat('yyyy-MM-dd')}{' '}
        <Typography.Body secondary>
          <SwapRightOutlined disabled={true} />
        </Typography.Body>{' '}
        {farm.endDateTime.toFormat('yyyy-MM-dd')}
      </Typography.Body>
    </Flex>
  </Box>
);
