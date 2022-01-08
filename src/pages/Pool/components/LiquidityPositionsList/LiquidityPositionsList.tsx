import './LiquidityPositionsList.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Button, Flex, PlusOutlined } from '../../../../ergodex-cdk';
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
  const history = useHistory();

  const onPositionClick = (id: PoolId) => {
    history.push(`/pool/${id}/`);
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
      {pools.map((pool, index) => {
        return (
          <Flex.Item
            key={index}
            marginBottom={index + 1 === pools.length ? 0 : 2}
          >
            <LiquidityPositionsItem pool={pool} onClick={onPositionClick} />
          </Flex.Item>
        );
      })}
    </Flex>
  );
};

export { LiquidityPositionsList };
