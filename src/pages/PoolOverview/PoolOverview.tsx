import { PoolId } from '@ergolabs/ergo-dex-sdk';
import {
  Alert,
  Button,
  Flex,
  LockOutlined,
  Menu,
  PlusOutlined,
  Skeleton,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as RelockIcon } from '../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../assets/icons/withdrawal-icon.svg';
import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { ConnectWalletButton as _ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { FarmsButton } from '../../components/FarmsButton/FarmsButton';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useSelectedNetwork } from '../../gateway/common/network';
import { useGuard } from '../../hooks/useGuard';
import { getAmmPoolConfidenceAnalyticByAmmPoolId } from './AmmPoolConfidenceAnalytic';
import { LockLiquidityChart } from './LockLiquidityChart/LockLiquidityChart';
import { PoolFeeTag } from './PoolFeeTag/PoolFeeTag';
import { PoolRatio } from './PoolRatio/PoolRatio';

const MIN_RELEVANT_LOCKS_PCT = 1;

const ConnectWalletButton = styled(_ConnectWalletButton)`
  width: 100%;
`;

export const PoolOverview: React.FC = () => {
  const navigate = useNavigate();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [selectedNetwork] = useSelectedNetwork();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));
  const { s } = useDevice();
  const [poolConfidenceAnalytic] = useObservable(
    getAmmPoolConfidenceAnalyticByAmmPoolId(poolId),
  );

  useGuard(position, loading, () => navigate('../../../liquidity'));

  const handleLockLiquidity = () => navigate(`lock`);

  const handleRemovePositionClick = () => navigate(`remove`);

  const handleAddLiquidity = () => navigate(`add`);

  const handleRelockLiquidity = () => navigate(`relock`);

  const handleWithdrawalLiquidity = () => navigate(`withdrawal`);

  const handleFarmsButtonClick = () =>
    navigate(`../../../farm?searchString=${position?.pool.id}`);

  return (
    <Page title={t`Pool overview`} maxWidth={620} withBackButton backTo="/pool">
      {position && poolConfidenceAnalytic ? (
        <Flex col>
          <Flex.Item marginBottom={5}>
            <PageHeader
              position={position}
              actionsMenuWidth={180}
              actionsMenu={
                selectedNetwork.name !== 'cardano' && (
                  <Menu.ItemGroup title={t`Liquidity Locker`}>
                    <Menu.Item
                      disabled={
                        position.empty || !position.availableLp.isPositive()
                      }
                      icon={<LockOutlined />}
                      onClick={handleLockLiquidity}
                    >
                      <a>
                        <Trans>Lock liquidity</Trans>
                      </a>
                    </Menu.Item>
                    <Menu.Item
                      disabled={position.locks.length === 0}
                      icon={<RelockIcon />}
                      onClick={handleRelockLiquidity}
                    >
                      <a>
                        <Trans>Relock liquidity</Trans>
                      </a>
                    </Menu.Item>
                    <Menu.Item
                      disabled={position.locks.length === 0}
                      icon={<WithdrawalIcon />}
                      onClick={handleWithdrawalLiquidity}
                    >
                      <a>
                        <Trans>Withdrawal</Trans>
                      </a>
                    </Menu.Item>
                  </Menu.ItemGroup>
                )
              }
            >
              <Flex align="center">
                <Flex.Item marginRight={2}>
                  <PoolFeeTag ammPool={position.pool} />
                </Flex.Item>
                <FarmsButton onClick={handleFarmsButtonClick} />
              </Flex>
            </PageHeader>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <FormPairSection
              glass
              title={t`Total liquidity`}
              yAmount={position.pool.y}
              xAmount={position.pool.x}
            />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            {position.empty ? (
              <PageSection title={t`Your liquidity`} boxed={false}>
                <Alert
                  type="warning"
                  message={t`You didn't provide liquidity to this pool yet.`}
                />
              </PageSection>
            ) : (
              <FormPairSection
                glass
                title={t`Your liquidity`}
                yAmount={position.totalY}
                xAmount={position.totalX}
              />
            )}
          </Flex.Item>
          {poolConfidenceAnalytic.lockedPercent >= MIN_RELEVANT_LOCKS_PCT && (
            <Flex.Item marginBottom={4}>
              <PageSection glass title={t`Locked liquidity`} boxed={false}>
                <LockLiquidityChart
                  poolConfidenceAnalytic={poolConfidenceAnalytic}
                />
              </PageSection>
            </Flex.Item>
          )}
          <Flex.Item marginBottom={4}>
            <PageSection glass title={t`Current price`} boxed={false}>
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
              <ConnectWalletButton
                size="large"
                analytics={{ location: 'pool-overview' }}
              >
                <Flex.Item flex={1} marginRight={2}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleAddLiquidity}
                    disabled={applicationConfig.blacklistedPools.includes(
                      position.pool.id,
                    )}
                    block
                  >
                    {s ? (
                      <Trans>Increase</Trans>
                    ) : (
                      <Trans>Increase Liquidity</Trans>
                    )}
                  </Button>
                </Flex.Item>
                <Flex.Item flex={1}>
                  <Button
                    type="default"
                    disabled={
                      position.empty || !position.availableLp.isPositive()
                    }
                    size="large"
                    block
                    onClick={handleRemovePositionClick}
                  >
                    {s ? (
                      <Trans>Remove</Trans>
                    ) : (
                      <Trans>Remove Liquidity</Trans>
                    )}
                  </Button>
                </Flex.Item>
              </ConnectWalletButton>
            </Flex>
          </Flex.Item>
        </Flex>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
