import './LiquidityPositionsList.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Button, Flex, List, PlusOutlined } from '../../../../ergodex-cdk';
import { isWalletSetuped$ } from '../../../../services/new/core';
import { EmptyPositionsWrapper } from '../EmptyPositionsWrapper/EmptyPositionsWrapper';
import { PositionListLoader } from '../PositionListLoader/PositionListLoader';
import { LiquidityPositionsItem } from './LiquidityPositionsItem/LiquidityPositionsItem';

interface LiquidityPositionsListProps {
  loading: boolean;
  pools: AmmPool[];
}

const LiquidityPositionsList: FC<LiquidityPositionsListProps> = ({
  loading,
  pools,
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

  if (isEmpty(pools) && !loading) {
    return (
      <EmptyPositionsWrapper>
        <Button
          type="primary"
          size="middle"
          onClick={handleAddLiquidity}
          icon={<PlusOutlined />}
        >
          Add Position
        </Button>
      </EmptyPositionsWrapper>
    );
  }

  return (
    <Flex col>
      <List dataSource={pools} gap={2}>
        {(pool) => (
          <LiquidityPositionsItem pool={pool} onClick={onPositionClick} />
        )}
      </List>
    </Flex>
  );
};

export { LiquidityPositionsList };
