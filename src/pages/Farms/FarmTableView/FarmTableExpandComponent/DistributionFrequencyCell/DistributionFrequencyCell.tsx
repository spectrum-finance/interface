import { Box, Flex, SwapRightOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';

export interface DistributionFrequencyCellProps {
  readonly farm: Farm;
}

export const DistributionFrequencyCell: FC<DistributionFrequencyCellProps> = ({
  farm,
}) => (
  <Box width="100%" height="100%" transparent bordered={false} padding={[0, 4]}>
    <Flex col justify="center" stretch>
      <Typography.Body secondary size="small">
        <Trans>Distribution frequency</Trans>
      </Typography.Body>
      <Typography.Body>
        {farm.distributionFrequencyInDays} <Trans>days</Trans> (
        {farm.distributionFrequencyInBlocks} <Trans>blocks</Trans>)
      </Typography.Body>
    </Flex>
  </Box>
);
