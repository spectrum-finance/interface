import './LiquidityPositionsList.less';

import { AmmPool, PoolId } from '@ergolabs/ergo-dex-sdk';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { FeeTag } from '../../../../components/common/FeeTag/FeeTag';
import { TokenIconPair } from '../../../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Flex,
  PlusOutlined,
  Tag,
  Tooltip,
  Typography,
  WarningOutlined,
} from '../../../../ergodex-cdk';
import { useObservable, useSubject } from '../../../../hooks/useObservable';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../../services/new/analytics';
import { isWalletLoading$ } from '../../../../services/new/core';
import { availablePools$ } from '../../../../services/new/pools';
import { formatToUSD } from '../../../../services/number';
import { renderFractions } from '../../../../utils/math';
import { getPoolRatio } from '../../../../utils/price';
import { EmptyPositionsWrapper } from '../EmptyPositionsWrapper/EmptyPositionsWrapper';
import { PositionListItemLoader } from '../PositionListItemLoader/PositionListItemLoader';
import { PositionListLoader } from '../PositionListLoader/PositionListLoader';

interface LiquidityPositionsListProps {
  pools: Array<AmmPool>;
}

interface PoolPositionProps {
  pool: AmmPool;
  onClick: (poolId: PoolId) => void;
}

interface PoolPositionMainProps {
  pool: AmmPool;
}

interface PoolPositionWrapperProps {
  poolId: PoolId;
  children: React.ReactChild | React.ReactChild[];
  onClick: (poolId: PoolId) => void;
}

const testPoolIds = [
  'f1fb942ebd039dc782fd9109acdb60aabea4dc7e75e9c813b6528c62692fc781',
];

const isTestPool = (poolId: PoolId) => {
  return testPoolIds.some((id) => id === poolId);
};

const PoolPositionWrapper: React.FC<PoolPositionWrapperProps> = ({
  poolId,
  children,
  onClick,
}): JSX.Element => {
  return (
    <Box className="pool-position" padding={4} borderRadius="m">
      <Flex onClick={() => onClick(poolId)} align="center">
        {children}
      </Flex>
    </Box>
  );
};

const PoolPositionMain: React.FC<PoolPositionMainProps> = ({
  pool,
}): JSX.Element => {
  const { xPerY, yPerX } = getPoolRatio(pool);

  return (
    <Flex align="center" style={{ minWidth: '400px' }}>
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
  );
};

const PoolPosition: React.FC<PoolPositionProps> = ({ pool, onClick }) => {
  const [positionAnalytics, updatePositionAnalytics] = useSubject(
    getAggregatedPoolAnalyticsDataById24H,
  );

  useEffect(() => {
    updatePositionAnalytics(pool.id);
  }, [pool]);

  if (isTestPool(pool.id)) {
    return (
      <PoolPositionWrapper poolId={pool.id} onClick={onClick}>
        <PoolPositionMain pool={pool} />
      </PoolPositionWrapper>
    );
  }

  return (
    <>
      {positionAnalytics ? (
        <PoolPositionWrapper poolId={pool.id} onClick={onClick}>
          <PoolPositionMain pool={pool} />
          <Flex.Item grow>
            <Flex justify="space-between">
              <Flex.Item>
                <Flex col justify="space-between">
                  <Flex.Item marginBottom={1}>
                    <Typography.Footnote>TVL</Typography.Footnote>
                  </Flex.Item>
                  <DataTag
                    size="large"
                    content={formatToUSD(
                      renderFractions(
                        positionAnalytics?.tvl.value,
                        positionAnalytics?.tvl.units.currency.decimals,
                      ),
                      'abbr',
                    )}
                  />
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex col justify="space-between">
                  <Flex.Item marginBottom={1}>
                    <Typography.Footnote>Volume 24H</Typography.Footnote>
                  </Flex.Item>
                  <DataTag
                    size="large"
                    content={formatToUSD(
                      renderFractions(
                        positionAnalytics?.volume.value,
                        positionAnalytics?.volume.units.currency.decimals,
                      ),
                      'abbr',
                    )}
                  />
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex col justify="space-between">
                  <Flex.Item marginBottom={1}>
                    <Typography.Footnote>Yearly Fees</Typography.Footnote>
                  </Flex.Item>
                  <DataTag
                    size="large"
                    content={`${positionAnalytics.yearlyFeesPercent}%`}
                  />
                </Flex>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </PoolPositionWrapper>
      ) : (
        <PositionListItemLoader />
      )}
    </>
  );
};

const LiquidityPositionsList: FC = (): JSX.Element => {
  const history = useHistory();

  const [pools, loading] = useObservable(availablePools$, {
    defaultValue: [],
  });
  const [walletLoading] = useObservable(isWalletLoading$);

  const onPositionClick = (id: PoolId) => {
    history.push(`/pool/${id}/`);
  };

  function handleAddLiquidity() {
    history.push('/pool/add');
  }
  console.log(walletLoading, loading, pools);
  if (walletLoading || loading) {
    return <PositionListLoader />;
  }
  console.log(walletLoading, loading, pools);
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
      <Flex.Item marginBottom={2}>
        <Typography.Title level={5}>Your positions</Typography.Title>
      </Flex.Item>
      <Flex col>
        {pools.map((pool, index) => {
          return (
            <Flex.Item
              key={index}
              marginBottom={index + 1 === pools.length ? 0 : 2}
            >
              <PoolPosition pool={pool} onClick={onPositionClick} />
            </Flex.Item>
          );
        })}
      </Flex>
    </Flex>
  );
};

export { LiquidityPositionsList };
