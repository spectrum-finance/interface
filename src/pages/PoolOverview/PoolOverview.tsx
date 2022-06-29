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
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as RelockIcon } from '../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../assets/icons/withdrawal-icon.svg';
import { useSubject } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useSelectedNetwork } from '../../gateway/common/network';
import { getAmmPoolConfidenceAnalyticByAmmPoolId } from './AmmPoolConfidenceAnalytic';
import { LockLiquidityChart } from './LockLiquidityChart/LockLiquidityChart';
import { PoolFeeTag } from './PoolFeeTag/PoolFeeTag';
import { PoolRatio } from './PoolRatio/PoolRatio';

const MIN_RELEVANT_LOCKS_PCT = 1;

export const PoolOverview: React.FC = () => {
  const navigate = useNavigate();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [selectedNetwork] = useSelectedNetwork();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId, []);
  const [poolConfidenceAnalytic, updatePoolConfidenceAnalytic] = useSubject(
    getAmmPoolConfidenceAnalyticByAmmPoolId,
  );

  useEffect(() => {
    updatePosition(poolId);
    updatePoolConfidenceAnalytic(poolId);
  }, []);

  const handleLockLiquidity = () => navigate(`lock`);

  const handleRemovePositionClick = () => navigate(`remove`);

  const handleAddLiquidity = () => navigate(`add`);

  const handleRelockLiquidity = () => navigate(`relock`);

  const handleWithdrawalLiquidity = () => navigate(`withdrawal`);

  return (
    <Page title={t`Pool overview`} width={620} withBackButton backTo="/pool">
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
                      disabled={position.empty}
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
              <PoolFeeTag ammPool={position.pool} />
            </PageHeader>
          </Flex.Item>
          {!position.verified && (
            <Flex.Item marginBottom={4}>
              <Alert
                type="error"
                message={t`This pool has not been verified by the ErgoDEX team`}
                description={t`The pool may contain fake or scam assets. Only use this pool if you have done your own research.`}
              />
            </Flex.Item>
          )}
          <Flex.Item marginBottom={4}>
            <FormPairSection
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
                title={t`Your liquidity`}
                yAmount={position.totalY}
                xAmount={position.totalX}
              />
            )}
          </Flex.Item>
          {poolConfidenceAnalytic.lockedPercent >= MIN_RELEVANT_LOCKS_PCT && (
            <Flex.Item marginBottom={4}>
              <PageSection title={t`Locked liquidity`} boxed={false}>
                <LockLiquidityChart
                  poolConfidenceAnalytic={poolConfidenceAnalytic}
                />
              </PageSection>
            </Flex.Item>
          )}
          <Flex.Item marginBottom={4}>
            <PageSection title={t`Current price`} boxed={false}>
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
                  disabled={applicationConfig.blacklistedPools.includes(
                    position.pool.id,
                  )}
                  block
                >
                  <Trans>Increase Liquidity</Trans>
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
                  <Trans>Remove Liquidity</Trans>
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
