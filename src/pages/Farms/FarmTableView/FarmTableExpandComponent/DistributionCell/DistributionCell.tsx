import { Box, Flex, Progress, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';

export interface DistributionCellProps {
  readonly farm: Farm;
}

export const DistributionCell: FC<DistributionCellProps> = ({ farm }) => (
  <Box width="100%" height="100%" transparent bordered={false} padding={[0, 4]}>
    <Flex col justify="center" stretch>
      <Flex.Item marginBottom={1}>
        <Typography.Body secondary size="small">
          <Trans>Distributed</Trans>
        </Typography.Body>
      </Flex.Item>
      <Progress percent={farm.distributed} strokeWidth={24} />
    </Flex>
  </Box>
);
