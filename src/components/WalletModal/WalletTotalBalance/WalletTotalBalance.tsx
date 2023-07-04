import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import * as React from 'react';

import { Currency } from '../../../common/models/Currency';
import { AssetIcon } from '../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';
import { SensitiveContent } from '../../SensitiveContent/SensitiveContent.tsx';
import { WalletModalSkeletonLoader } from '../WalletModalSkeletonLoader/WalletModalSkeletonLoader.tsx';

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
      {balance?.toCurrencyString() ? (
        <Box padding={[3, 4]} borderRadius="l" secondary>
          <Flex row align="center">
            <Flex.Item marginRight={2}>
              <AssetIcon asset={balance?.asset} />
            </Flex.Item>
            <Flex.Item flex={1} display="flex">
              <Flex.Item marginRight={1}>
                <SensitiveContent>
                  <Typography.Title level={4}>
                    {balance.toCurrencyString()}
                  </Typography.Title>
                </SensitiveContent>
              </Flex.Item>
            </Flex.Item>
            <Flex.Item>
              <Typography.Body secondary size="small" strong>
                <ConvenientAssetView sensitive value={balance} />
              </Typography.Body>
            </Flex.Item>
          </Flex>
        </Box>
      ) : (
        <WalletModalSkeletonLoader />
      )}
    </Flex>
  );
};
