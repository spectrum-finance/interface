import React from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';

export const AnalyticsData = (): JSX.Element => {
  return (
    <Box borderRadius="m" gray>
      <Flex>
        <Flex.Item display="flex">
          <Box borderRadius="s">
            <Typography.Body style={{ whiteSpace: 'nowrap' }}>
              TVL 24: coming soon
            </Typography.Body>
          </Box>
        </Flex.Item>
        <Flex.Item display="flex">
          <Box borderRadius="s">
            <Typography.Body style={{ whiteSpace: 'nowrap' }}>
              Volume 24: coming soon
            </Typography.Body>
          </Box>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
