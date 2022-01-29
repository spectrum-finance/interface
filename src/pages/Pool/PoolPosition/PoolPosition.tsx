import './PoolPosition.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getAmmPoolById } from '../../../api/ammPools';
import { ReactComponent as RelockIcon } from '../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../assets/icons/withdrawal-icon.svg';
import { useSubject } from '../../../common/hooks/useObservable';
import { OptionsButton } from '../../../components/common/OptionsButton/OptionsButton';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Alert,
  Box,
  Button,
  Flex,
  LockOutlined,
  Menu,
  PlusOutlined,
  Skeleton,
  Typography,
} from '../../../ergodex-cdk';
import { usePair } from '../../../hooks/usePair';
import { getPoolFee } from '../../../utils/pool';
import { getPoolRatio } from '../../../utils/price';
import { LockLiquidityChart } from './LockLiquidityChart/LockLiquidityChart';
import { PriceView } from './PriceView';

interface URLParamTypes {
  poolId: PoolId;
}

export const PoolPosition: React.FC = () => {
  const history = useHistory();
  const { poolId } = useParams<URLParamTypes>();
  const [poolRatio, setPoolRatio] = useState<Ratio | undefined>();

  const [pool, updatePool] = useSubject(getAmmPoolById, []);
  // console.log(pool);
  const { pair, isPairLoading } = usePair(pool);

  useEffect(() => updatePool(poolId), []);
  useEffect(() => {
    if (pool) {
      const ratio = getPoolRatio(pool);
      setPoolRatio(ratio);
    }
  }, [pool?.id]);

  const handleLockLiquidity = () => history.push(`/pool/${poolId}/lock`);

  const handleRemovePositionClick = () =>
    history.push(`/pool/${poolId}/remove`);

  const handleAddLiquidity = () => history.push(`/pool/${poolId}/add`);
  const handleRelockLiquidity = () => history.push(`/pool/${poolId}/relock`);
  const handleWithdrawalLiquidity = () =>
    history.push(`/pool/${poolId}/withdrawal`);

  return (
    <FormPageWrapper
      title="Pool overview"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {pool && poolRatio && !isPairLoading ? (
        <>
          <Flex align="center" justify="space-between">
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
            <Flex.Item>
              <OptionsButton size="large" type="text" width={180}>
                <Menu.ItemGroup title="Liquidity Locker">
                  <Menu.Item
                    icon={<LockOutlined />}
                    onClick={handleLockLiquidity}
                  >
                    <a>Lock liquidity</a>
                  </Menu.Item>
                  <Menu.Item
                    icon={<RelockIcon />}
                    onClick={handleRelockLiquidity}
                  >
                    <a>Relock liquidity</a>
                  </Menu.Item>
                  <Menu.Item
                    icon={<WithdrawalIcon />}
                    onClick={handleWithdrawalLiquidity}
                  >
                    <a>Withdrawal</a>
                  </Menu.Item>
                </Menu.ItemGroup>
              </OptionsButton>
            </Flex.Item>
          </Flex>

          <Flex direction="col" style={{ marginTop: 16, marginBottom: 16 }}>
            <Typography.Text>Your Liquidity</Typography.Text>

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
          <LockLiquidityChart />
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
                  onClick={handleAddLiquidity}
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
                  onClick={handleRemovePositionClick}
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
