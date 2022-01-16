import './PoolPosition.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useSubject } from '../../../common/hooks/useObservable';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Alert,
  Box,
  Button,
  Flex,
  LockOutlined,
  PlusOutlined,
  Skeleton,
  Tooltip,
  Typography,
} from '../../../ergodex-cdk';
import { usePair } from '../../../hooks/usePair';
import { getPoolById } from '../../../services/new/pools';
import { getPoolFee } from '../../../utils/pool';
import { getPoolRatio } from '../../../utils/price';
import { PriceView } from './PriceView';

interface URLParamTypes {
  poolId: PoolId;
}

export const PoolPosition: React.FC = () => {
  const history = useHistory();
  const { poolId } = useParams<URLParamTypes>();
  const [poolRatio, setPoolRatio] = useState<Ratio | undefined>();

  const [pool, updatePool] = useSubject(getPoolById);

  const { pair, isPairLoading } = usePair(pool);

  useEffect(() => {
    updatePool(poolId);
    if (pool) {
      const ratio = getPoolRatio(pool);
      setPoolRatio(ratio);
    }
  }, [pool]);

  const handleLockLiquidityClick = (id: PoolId) => {
    history.push(`/pool/lock/${id}/`);
  };

  const handleRemovePositionClick = (id: PoolId) => {
    history.push(`/remove/${id}/`);
  };

  const handleAddLiquidity = (id: PoolId) => {
    history.push(`/pool/add/${id}/`);
  };

  return (
    <FormPageWrapper
      title="Position overview"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {pool && poolRatio && !isPairLoading ? (
        <>
          <Flex align="center">
            <TokenIconPair
              size="large"
              tokenPair={{
                tokenA: pool.x.asset.name,
                tokenB: pool.y.asset.name,
              }}
            />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${pool.x.asset.name} / ${pool.y.asset.name}`}
            </Typography.Title>
            <Flex.Item marginLeft={2}>
              <Box padding={[0.5, 1]} contrast>
                <Typography.Text style={{ fontSize: '12px' }}>
                  {getPoolFee(pool.feeNum)}%
                </Typography.Text>
              </Box>
            </Flex.Item>
          </Flex>

          <Flex direction="col" style={{ marginTop: 16 }}>
            <Flex justify="space-between">
              <Typography.Text>Your Liquidity</Typography.Text>
              <Flex.Item>
                <Tooltip title="Lock liquidity">
                  <Button
                    onClick={() => handleLockLiquidityClick(poolId)}
                    size="small"
                    icon={<LockOutlined />}
                  />
                </Tooltip>
              </Flex.Item>
            </Flex>

            <Flex.Item marginTop={2}>
              {pair ? (
                <Box padding={3} className="liquidity-info__wrapper">
                  <Flex direction="col">
                    <Flex justify="space-between">
                      <Flex>
                        <TokenIcon name={pair.assetX.name} />
                        <Typography.Title level={5} style={{ marginLeft: 4 }}>
                          {pair.assetX.name}
                        </Typography.Title>
                      </Flex>
                      <Flex>
                        <Typography.Title level={5}>
                          {pair.assetX.amount}
                        </Typography.Title>
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" style={{ marginTop: 16 }}>
                      <Flex>
                        <TokenIcon name={pair.assetY.name} />
                        <Typography.Title level={5} style={{ marginLeft: 4 }}>
                          {pair.assetY.name}
                        </Typography.Title>
                      </Flex>
                      <Flex>
                        <Typography.Title level={5}>
                          {pair.assetY.amount}
                        </Typography.Title>
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              ) : (
                <Alert
                  type="warning"
                  message="You didn't provide liquidity to this pool yet."
                />
              )}
            </Flex.Item>
          </Flex>
          <Flex col style={{ marginTop: 16 }}>
            <Typography.Text>Current Price</Typography.Text>
            <Flex style={{ marginTop: 10 }}>
              <Flex.Item flex={1} marginRight={2}>
                <PriceView
                  className="price__wrapper"
                  price={poolRatio.xPerY}
                  desc={`${pool.x.asset.name} per ${pool.y.asset.name}`}
                />
              </Flex.Item>
              <Flex.Item flex={1}>
                <PriceView
                  className="price__wrapper"
                  price={poolRatio.yPerX}
                  desc={`${pool.y.asset.name} per ${pool.x.asset.name}`}
                />
              </Flex.Item>
            </Flex>

            <Flex style={{ marginTop: 16 }}>
              <Flex.Item flex={1} marginRight={1}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddLiquidity(poolId)}
                  block
                >
                  Increase Liquidity
                </Button>
              </Flex.Item>
              <Flex.Item flex={1} marginLeft={1}>
                <Button
                  type="default"
                  disabled={!pair}
                  size="large"
                  block
                  onClick={() => handleRemovePositionClick(poolId)}
                >
                  Remove Liquidity
                </Button>
              </Flex.Item>
            </Flex>
          </Flex>
        </>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};
