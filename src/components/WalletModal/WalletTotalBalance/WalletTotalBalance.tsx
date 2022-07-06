import { Box, Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { Currency } from '../../../common/models/Currency';
import { AssetIcon } from '../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';

interface WalletTotalBalanceProps {
  balance?: Currency;
}

const BalanceLoading = styled(LoadingOutlined)`
  font-size: 24px;
`;

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
        {balance?.toCurrencyString() ? (
          <Flex row align="center">
            <Flex.Item marginRight={2}>
              <AssetIcon asset={balance?.asset} />
            </Flex.Item>
            <Flex.Item flex={1}>
              <Typography.Title level={4}>
                {balance.toCurrencyString()}
              </Typography.Title>
            </Flex.Item>
            <Flex.Item>
              <Typography.Footnote>
                <ConvenientAssetView value={balance} prefix="~" />
              </Typography.Footnote>
            </Flex.Item>
          </Flex>
        ) : (
          <BalanceLoading />
        )}
      </Box>
    </Flex>
  );
};
