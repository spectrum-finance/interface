import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Trans } from '@lingui/macro';
import React from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { AssetIconPair } from '../../../../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../../../components/ListItemWrapper/ListItemWrapper';
import { Truncate } from '../../../../../../components/Truncate/Truncate';
import { VerificationMark } from '../../../../../../components/VerificationMark/VerificationMark';
import { Flex, Typography } from '../../../../../../ergodex-cdk';

interface LiquidityPositionsItemWrapperProps {
  pool: AmmPool;
  onClick: (poolId: PoolId) => void;
  children: React.ReactChild | React.ReactChild[] | null;
}

const LiquidityPositionsItemWrapper: React.FC<LiquidityPositionsItemWrapperProps> =
  ({ pool, onClick, children }): JSX.Element => {
    return (
      <ListItemWrapper onClick={() => onClick(pool.id)}>
        <Flex align="center">
          <Flex align="center" justify="space-between" style={{ width: '60%' }}>
            <Flex.Item marginRight={2}>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Flex align="center">
                    <Flex.Item marginRight={1}>
                      <AssetIconPair
                        assetX={pool.x.asset}
                        assetY={pool.y.asset}
                        size="large"
                      />
                    </Flex.Item>
                    <Flex.Item>
                      <Typography.Title level={5}>
                        <Truncate>{pool.x.asset.name}</Truncate>/
                        <Truncate>{pool.y.asset.name}</Truncate>
                      </Typography.Title>
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
                        content={
                          <>
                            <Truncate>{pool.x.asset.name}</Truncate>/
                            <Truncate>{pool.y.asset.name}</Truncate>:{' '}
                            {pool.xRatio.toString()}
                          </>
                        }
                      />
                    </Flex.Item>
                    <Flex.Item>
                      <DataTag
                        size="small"
                        content={
                          <>
                            <Truncate>{pool.y.asset.name}</Truncate>/
                            <Truncate>{pool.x.asset.name}</Truncate>:{' '}
                            {pool.yRatio.toString()}
                          </>
                        }
                      />
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item marginRight={16}>
              <Flex col justify="space-between">
                <Flex.Item marginBottom={1}>
                  <Typography.Footnote>
                    <Trans>Fee tier</Trans>
                  </Typography.Footnote>
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
