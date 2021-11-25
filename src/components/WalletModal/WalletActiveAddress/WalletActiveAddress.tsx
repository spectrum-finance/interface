import React from 'react';

import { useSettings } from '../../../context';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { Spin } from '../../../ergodex-cdk/components/Spin/Spin';
import { getShortAddress } from '../../../utils/string/addres';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';

export const WalletActiveAddress = () => {
  const [{ address }] = useSettings();

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>Active address</Typography.Body>
      </Flex.Item>
      <Box padding={[2, 4]} borderRadius="m" contrast>
        {address ? (
          <Flex row align="center">
            <Flex.Item flex={1}>
              <Typography.Body strong>
                {address ? getShortAddress(address) : ''}
              </Typography.Body>
            </Flex.Item>
            <Flex.Item marginRight={2}>
              <CopyButton text={address} />
            </Flex.Item>
            <ExploreButton to={address} />
          </Flex>
        ) : (
          <Spin size="small" />
        )}
      </Box>
    </Flex>
  );
};
