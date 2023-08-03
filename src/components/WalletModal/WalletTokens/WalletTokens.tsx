import { Button, EmptyDataState, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { List } from '../../List/List';
import { ListStateView } from '../../List/ListStateView/ListStateView';
import { makeSkeletonLoader } from '../../SkeletonLoader/makeSkeletonLoader.tsx';
import { SkeletonLoader } from '../../SkeletonLoader/SkeletonLoader.tsx';
import { TokenListItem } from './TokenListItem/TokenListItem';

export const WalletTokens: React.FC<{ close: () => void }> = ({ close }) => {
  const [balance, loading] = useAssetsBalance();
  const [selectedNetwork] = useSelectedNetwork();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSwapNow = () => {
    if (!location.pathname.match('swap')) {
      navigate('swap');
    }
    close();
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>
          <Trans>Tokens</Trans>
        </Typography.Body>
      </Flex.Item>

      <List
        itemKey={(item) => item.asset.id}
        items={balance.values().filter((b) => b.isPositive())}
        maxHeight={268}
        itemHeight={64}
        gap={1}
      >
        {({ item }) => <TokenListItem currency={item} />}
        <ListStateView name="loading" condition={loading}>
          {makeSkeletonLoader(<SkeletonLoader height={62} />, 4)}
        </ListStateView>
        <ListStateView name="empty" condition={balance.entries().length === 1}>
          <EmptyDataState height={250}>
            <Flex col>
              <Flex.Item>
                <Trans>
                  You don&apos;t have any tokens on your wallet yet.
                  <br />
                  But you can swap {selectedNetwork.networkAsset.ticker} for
                  them!
                </Trans>
              </Flex.Item>
              <Flex.Item marginTop={4}>
                <Button type="primary" onClick={handleSwapNow}>
                  <Trans>Swap now</Trans>
                </Button>
              </Flex.Item>
            </Flex>
          </EmptyDataState>
        </ListStateView>
      </List>
    </Flex>
  );
};
