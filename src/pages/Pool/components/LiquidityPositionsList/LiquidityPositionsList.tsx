import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { isWalletSetuped$ } from '../../../../api/wallets';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Button, Flex, List, PlusOutlined } from '../../../../ergodex-cdk';
import { EmptySearchResult } from '../../common/EmptySearchResult/EmptySearchResult';
import { EmptyPositionsWrapper } from '../EmptyPositionsWrapper/EmptyPositionsWrapper';
import { PositionListLoader } from '../PositionListLoader/PositionListLoader';
import { LiquidityPositionsItem } from './LiquidityPositionsItem/LiquidityPositionsItem';

interface LiquidityPositionsListProps {
  loading: boolean;
  totalCount: number;
  pools: AmmPool[];
}

const LiquidityPositionsList: FC<LiquidityPositionsListProps> = ({
  loading,
  pools,
  totalCount,
}): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, [], false);

  const history = useHistory();

  const onPositionClick = (id: PoolId) => {
    if (isWalletConnected) {
      history.push(`/pool/${id}/`);
    }
  };

  function handleAddLiquidity() {
    history.push('/pool/add');
  }

  if (loading) {
    return <PositionListLoader />;
  }

  if (!totalCount && !loading) {
    return (
      <EmptyPositionsWrapper>
        <Button
          type="primary"
          size="middle"
          onClick={handleAddLiquidity}
          icon={<PlusOutlined />}
        >
          Add Liquidity
        </Button>
      </EmptyPositionsWrapper>
    );
  }

  return (
    <Flex col>
      <List dataSource={pools} gap={2} emptyTemplate={<EmptySearchResult />}>
        {(pool) => (
          <LiquidityPositionsItem pool={pool} onClick={onPositionClick} />
        )}
      </List>
    </Flex>
  );
};

export { LiquidityPositionsList };
