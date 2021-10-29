import './LiquidityPositionsList.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import React from 'react';

import {
  TokenIconPair,
  TokenPair,
} from '../../../components/TokenIconPair/TokenIconPair';
import { Box, Col, Row, Typography } from '../../../ergodex-cdk';
import { getPoolFee } from '../../../services/pool';

interface LiquidityPositionsListProps {
  positions: Array<AmmPool> | null;
}

interface PoolPositionProps {
  onClick: () => void;
  tokenPair: TokenPair;
  poolFee: bigint;
}

const PoolPosition: React.FC<PoolPositionProps> = ({
  onClick,
  tokenPair,
  poolFee,
}) => {
  return (
    <Box className="pool-position" padding={4} borderRadius="m">
      <Row onClick={onClick} justify="center" align="middle">
        <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
          <TokenIconPair tokenPair={tokenPair} />
        </Col>
        <Col span={16}>
          <Typography.Title
            level={5}
          >{`${tokenPair.tokenA} / ${tokenPair.tokenB}`}</Typography.Title>
        </Col>
        <Col
          span={3}
          offset={2}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Box contrast inline>
            <Typography.Body>{getPoolFee(poolFee)}%</Typography.Body>
          </Box>
        </Col>
      </Row>
    </Box>
  );
};

const LiquidityPositionsList: React.FC<LiquidityPositionsListProps> = ({
  positions,
}): JSX.Element => {
  const onPositionClick = () => {};

  return (
    <Box contrast padding={[4, 2]} borderRadius="m">
      <Box transparent padding={[0, 5]}>
        <Row bottomGutter={4}>
          <Col span={18}>
            <Typography.Body strong>Your positions</Typography.Body>
          </Col>
          <Col span={6}>
            <Row justify="end">
              <Typography.Footnote>Fee</Typography.Footnote>
            </Row>
          </Col>
        </Row>
      </Box>
      {positions &&
        positions.map((position, index) => {
          return (
            <Row
              key={index}
              bottomGutter={index !== positions.length - 1 ? 2 : 0}
            >
              <Col span={24}>
                <PoolPosition
                  onClick={onPositionClick}
                  tokenPair={{
                    tokenA: position.assetX.name ? position.assetX.name : '',
                    tokenB: position.assetY.name ? position.assetY.name : '',
                  }}
                  poolFee={position.feeNum}
                />
              </Col>
            </Row>
          );
        })}
    </Box>
  );
};

export { LiquidityPositionsList };
