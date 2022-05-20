import { Trans } from '@lingui/macro';
import React from 'react';

import { Currency } from '../../../common/models/Currency';
import { Box, Flex, LoadingOutlined, Typography } from '../../../ergodex-cdk';
import { AssetIcon } from '../../AssetIcon/AssetIcon';
import { UsdView } from '../../UsdView/UsdView';


interface WalletTotalBalanceProps {
  balance?: Currency;
}

export const WalletTotalBalance: React.FC<WalletTotalBalanceProps> = ({
  balance,
}) => {
  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>
          <Trans>Total balance</Trans>
        </Typography.Body>
      </Flex.Item>
      <Box padding={[2, 4]} borderRadius="m" contrast>
        <Flex row align="center">
          <Flex.Item marginRight={2}>
            <AssetIcon asset={balance?.asset} />
          </Flex.Item>
          <Flex.Item flex={1}>
            <Typography.Title level={4}>
              {balance?.toCurrencyString() ?? <LoadingOutlined />}
            </Typography.Title>
          </Flex.Item>
          <Flex.Item>
            <Typography.Footnote>
              <UsdView value={balance} prefix="~" />
            </Typography.Footnote>
          </Flex.Item>
        </Flex>
      </Box>
    </Flex>
  );
};
