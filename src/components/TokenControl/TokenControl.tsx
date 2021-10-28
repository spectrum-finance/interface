import React from 'react';

import { Box, Button, Input, Typography } from '../../ergodex-cdk';
import { Flex } from '../../ergodex-cdk/components/Flex/Flex';
import { TokenInput } from './TokenInput/TokenInput';

export const TokenControl = () => (
  <Box padding={4} borderRadius="l">
    <Flex>
      <TokenInput label={'Ergo'} value={'123'} onChange={() => {}} />
      <Flex flexDirection="row" alignItems="center">
        <Flex.Item marginRight={2}>
          <Typography.Body>Balance: 0.02 ERG</Typography.Body>
        </Flex.Item>
        <Button ghost type="primary" size="small">
          Max
        </Button>
      </Flex>
    </Flex>
  </Box>
);
