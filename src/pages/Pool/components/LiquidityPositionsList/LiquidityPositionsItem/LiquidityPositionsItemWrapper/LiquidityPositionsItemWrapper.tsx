import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { FeeTag } from '../../../../../../components/common/FeeTag/FeeTag';
import { ListItemWrapper } from '../../../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIconPair } from '../../../../../../components/TokenIconPair/TokenIconPair';
import {
  Flex,
  Tag,
  Tooltip,
  Typography,
  WarningOutlined,
} from '../../../../../../ergodex-cdk';
import { getPoolRatio } from '../../../../../../utils/price';

const testPoolIds = [
  'f1fb942ebd039dc782fd9109acdb60aabea4dc7e75e9c813b6528c62692fc781',
  '65fa572bc4a7007e5a6450c9af2bfa1594e6dfb43b667027f1930eefddeac7bf',
];

const isTestPool = (poolId: PoolId) => {
  return testPoolIds.some((id) => id === poolId);
};

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
                        tokenPair={{
                          tokenA: pool.x.asset.name,
                          tokenB: pool.y.asset.name,
                        }}
                        size="large"
                      />
                    </Flex.Item>
                    <Flex.Item>
                      <Typography.Title
                        level={5}
                      >{`${pool.x.asset.name} / ${pool.y.asset.name}`}</Typography.Title>
                    </Flex.Item>
                    {isTestPool(pool.id) && (
                      <Flex.Item marginLeft={2}>
                        <Tooltip title="It is impossible to display statistics for this pool">
                          <Tag color="warning" icon={<WarningOutlined />}>
                            TIP
                          </Tag>
                        </Tooltip>
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
                <FeeTag fee={pool.feeNum} size="large" />
              </Flex>
            </Flex.Item>
          </Flex>
          {!isTestPool(pool.id) ? children : null}
        </Flex>
      </ListItemWrapper>
    );
  };

export { LiquidityPositionsItemWrapper };
