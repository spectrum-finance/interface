import React from 'react';

import { Currency } from '../../../common/models/Currency';
import { Box, Flex, LoadingOutlined, Typography } from '../../../ergodex-cdk';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

interface WalletTotalBalanceProps {
  balance?: Currency;
}

export const WalletTotalBalance: React.FC<WalletTotalBalanceProps> = ({
  balance,
}) => {
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
            <Typography.Title level={4}>
              {balance?.toCurrencyString() ?? <LoadingOutlined />}
            </Typography.Title>
          </Flex.Item>
          <Flex.Item>
            {/*<Typography.Body>{'~$300'}</Typography.Body>*/}
          </Flex.Item>
        </Flex>
      </Box>
    </Flex>
  );
};
