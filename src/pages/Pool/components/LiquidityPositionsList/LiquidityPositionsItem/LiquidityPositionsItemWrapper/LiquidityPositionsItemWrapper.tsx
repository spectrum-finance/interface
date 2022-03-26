import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIconPair } from '../../../../../../components/TokenIconPair/TokenIconPair';
import { VerificationMark } from '../../../../../../components/VerificationMark/VerificationMark';
import { Flex, Typography } from '../../../../../../ergodex-cdk';
import { getPoolRatio } from '../../../../../../utils/price';

interface LiquidityPositionsItemWrapperProps {
  pool: AmmPool;
  onClick: (poolId: PoolId) => void;
  children: React.ReactChild | React.ReactChild[] | null;
}

const LiquidityPositionsItemWrapper: React.FC<LiquidityPositionsItemWrapperProps> =
  ({ pool, onClick, children }): JSX.Element => {
    const { xPerY, yPerX } = getPoolRatio(pool);

    return (
      <ListItemWrapper onClick={() => onClick(pool.id)}>
        <Flex align="center">
          <Flex align="center" justify="space-between" style={{ width: '60%' }}>
            <Flex.Item marginRight={2}>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Flex align="center">
                    <Flex.Item marginRight={1}>
                      <TokenIconPair
                        assetX={pool.x.asset}
                        assetY={pool.y.asset}
                        size="large"
                      />
                    </Flex.Item>
                    <Flex.Item>
                      <Typography.Title
                        level={5}
                      >{`${pool.x.asset.name} / ${pool.y.asset.name}`}</Typography.Title>
                    </Flex.Item>
                    {pool.verified && (
                      <Flex.Item marginLeft={1} align="center">
                        <VerificationMark />
                      </Flex.Item>
                    )}
                  </Flex>
                </Flex.Item>
                <Flex.Item>
                  <Flex>
                    <Flex.Item marginRight={1}>
                      <DataTag
                        size="small"
                        content={`${pool.x.asset.name} / ${pool.y.asset.name}: ${xPerY}`}
                      />
                    </Flex.Item>
                    <Flex.Item>
                      <DataTag
                        size="small"
                        content={`${pool.y.asset.name} / ${pool.x.asset.name}: ${yPerX}`}
                      />
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item marginRight={16}>
              <Flex col justify="space-between">
                <Flex.Item marginBottom={1}>
                  <Typography.Footnote>Fee tier</Typography.Footnote>
                </Flex.Item>
                <DataTag content={`${pool.poolFee}%`} size="large" />
              </Flex>
            </Flex.Item>
          </Flex>
          {children}
        </Flex>
      </ListItemWrapper>
    );
  };

export { LiquidityPositionsItemWrapper };
