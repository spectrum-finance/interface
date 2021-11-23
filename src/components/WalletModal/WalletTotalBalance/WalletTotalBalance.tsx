import React from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { useObservable } from '../../../hooks/useObservable';
import { nativeTokenBalance$ } from '../../../services/new/core';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

export const WalletTotalBalance = () => {
  const [ergBalance] = useObservable(nativeTokenBalance$);

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>Total balance</Typography.Body>
      </Flex.Item>
      <Box padding={[2, 4]} borderRadius="m" contrast>
        <Flex row align="center">
          <Flex.Item marginRight={2}>
            <TokenIcon name="erg" />
          </Flex.Item>
          <Flex.Item flex={1}>
            <Typography.Title level={4}>{`${ergBalance} ERG`}</Typography.Title>
          </Flex.Item>
          <Flex.Item>
            {/*<Typography.Body>{'~$300'}</Typography.Body>*/}
          </Flex.Item>
        </Flex>
      </Box>
    </Flex>
  );
};
