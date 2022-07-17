import React, { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const AssetListExtendedSearchTitle: FC = () => (
  <Box transparent bordered={false} padding={0}>
    <Box height={38} control padding={[0, 3]}>
      <Flex align="center" stretch>
        <Typography.Body>
          <Trans>Expended results from Explorer</Trans>
        </Typography.Body>
      </Flex>
    </Box>
  </Box>
);
