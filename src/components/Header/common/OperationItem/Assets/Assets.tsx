import React, { FC } from 'react';

import {
  ArrowRightOutlined,
  Box,
  Flex,
  Typography,
} from '../../../../../ergodex-cdk';
import { TokenIcon } from '../../../../TokenIcon/TokenIcon';

const SwapAssets = () => (
  <Flex stretch align="center">
    <Flex.Item display="flex" marginRight={1}>
      <TokenIcon size="small" asset={{ id: '-1' }} />
      <Typography.Body strong>ERG</Typography.Body>
    </Flex.Item>
    <Flex.Item display="flex" marginRight={1}>
      <ArrowRightOutlined />
    </Flex.Item>
    <Flex.Item display="flex">
      <TokenIcon size="small" asset={{ id: '-1' }} />
      <Flex.Item marginLeft={1}>
        <Typography.Body strong>NETA</Typography.Body>
      </Flex.Item>
    </Flex.Item>
  </Flex>
);

export const Assets: FC = () => (
  <Box bordered={false} height="100%" padding={[3, 4]}>
    <SwapAssets />
  </Box>
);
