import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getPositionByAmmPoolId } from '../../api/positions';
import { ReactComponent as RelockIcon } from '../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../assets/icons/withdrawal-icon.svg';
import { useSubject } from '../../common/hooks/useObservable';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import {
  Alert,
  Button,
  Flex,
  LockOutlined,
  Menu,
  PlusOutlined,
  Skeleton,
  Typography,
} from '../../ergodex-cdk';
import { LockLiquidityChart } from './LockLiquidityChart/LockLiquidityChart';
import { PoolFeeTag } from './PoolFeeTag/PoolFeeTag';
import { PoolRatio } from './PoolRatio/PoolRatio';

interface URLParamTypes {
  poolId: PoolId;
}

export const PoolOverview: React.FC = () => {
  const history = useHistory();
  const { poolId } = useParams<URLParamTypes>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId, []);

  useEffect(() => updatePosition(poolId), []);

  const handleLockLiquidity = () => history.push(`/pool/${poolId}/lock`);

  const handleRemovePositionClick = () =>
    history.push(`/pool/${poolId}/remove`);

  const handleAddLiquidity = () => history.push(`/pool/${poolId}/add`);

  const handleRelockLiquidity = () => history.push(`/pool/${poolId}/relock`);

  const handleWithdrawalLiquidity = () =>
    history.push(`/pool/${poolId}/withdrawal`);

  return (
    <Page title="Pool overview" width={480} withBackButton backTo="/pool">
      {position ? (
        <Flex col>
          <Flex.Item marginBottom={5}>
            <PageHeader
              x={position.x}
              y={position.y}
              actionsMenu={
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
              }
            >
              <PoolFeeTag ammPool={position.pool} />
            </PageHeader>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <FormPairSection
              title="Pool liquidity"
              yAmount={position.pool.y}
              xAmount={position.pool.x}
            />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            {position.empty ? (
              <PageSection title="Your liquidity" boxed={false}>
                <Alert
                  type="warning"
                  message="You didn't provide liquidity to this pool yet."
                />
              </PageSection>
            ) : (
              <FormPairSection
                title="Your liquidity"
                yAmount={position.y}
                xAmount={position.x}
              />
            )}
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <PageSection title="Locked liquidity" boxed={false}>
              <LockLiquidityChart />
            </PageSection>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <PageSection title="Current price" boxed={false}>
              <Flex>
                <Flex.Item flex={1} marginRight={2}>
                  <Typography.Body>
                    <PoolRatio ammPool={position.pool} ratioOf="x" />
                  </Typography.Body>
                </Flex.Item>
                <Flex.Item flex={1}>
                  <Typography.Body>
                    <PoolRatio ammPool={position.pool} ratioOf="y" />
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </PageSection>
          </Flex.Item>
          <Flex.Item>
            <Flex>
              <Flex.Item flex={1} marginRight={2}>
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
              <Flex.Item flex={1}>
                <Button
                  type="default"
                  disabled={position.empty}
                  size="large"
                  block
                  onClick={handleRemovePositionClick}
                >
                  Remove Liquidity
                </Button>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
