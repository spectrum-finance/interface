import React, { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, PropsWithChildren } from 'react';

export const AssetListGroupTitle: FC<
  PropsWithChildren<Record<string, unknown>>
> = ({ children }) => (
  <Box transparent bordered={false} padding={0}>
    <Box height={38} control padding={[0, 3]}>
      <Flex align="center" stretch>
        <Typography.Body>{children}</Typography.Body>
      </Flex>
    </Box>
  </Box>
);
