import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, PropsWithChildren } from 'react';

export const AssetListGroupTitle: FC<
  PropsWithChildren<Record<string, unknown>>
> = ({ children }) => (
  <Box height={38} secondary borderRadius="l" padding={[0, 3]}>
    <Flex align="center" stretch>
      <Typography.Body>{children}</Typography.Body>
    </Flex>
  </Box>
);
