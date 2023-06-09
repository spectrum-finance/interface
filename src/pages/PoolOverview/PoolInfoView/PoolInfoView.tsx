import {
  Box,
  Button,
  Flex,
  LockOutlined,
  Menu,
  PlusOutlined,
  useDevice,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { applicationConfig } from '../../../applicationConfig';
import { ReactComponent as RelockIcon } from '../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../assets/icons/withdrawal-icon.svg';
import { useObservable } from '../../../common/hooks/useObservable';
import { Position } from '../../../common/models/Position';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FarmsButton } from '../../../components/FarmsButton/FarmsButton';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { hasFarmsForPool } from '../../../network/ergo/lm/api/farms/farms';
import { MyLiquidity } from './MyLiquidity/MyLiquidity';
import { PoolFeeTag } from './PoolFeeTag/PoolFeeTag';
import { TotalLiquidity } from './TotalLiquidity/TotalLiquidity';

export interface PoolInfoProps {
  readonly position: Position;
}

export const PoolInfoView: FC<PoolInfoProps> = ({ position }) => {
  const { valBySize, s } = useDevice();
  const navigate = useNavigate();
  const [selectedNetwork] = useSelectedNetwork();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(position.pool.id), []);

  const handleFarmsButtonClick = () =>
    navigate(`../../../farm?searchString=${position?.pool.id}`);

  const handleLockLiquidity = () => navigate(`lock`);

  const handleRemovePositionClick = () => navigate(`remove`);

  const handleAddLiquidity = () => navigate(`add`);

  const handleSwap = () =>
    navigate(
      `../../../swap?base=${position.pool.x.asset.id}&quote=${position.pool.y.asset.id}&initialPoolId=${position.pool.id}`,
    );

  const handleRelockLiquidity = () => navigate(`relock`);

  const handleWithdrawalLiquidity = () => navigate(`withdrawal`);

  return (
    <Box
      glass
      borderRadius="l"
      padding={6}
      height={valBySize(undefined, undefined, 590)}
    >
      <Flex col stretch>
        <Flex.Item marginBottom={4}>
          <PageHeader
            position={position}
            level={3}
            actionsMenuWidth={180}
            actionButtonSize="large"
            actionsMenu={
              selectedNetwork.name === 'ergo' && (
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
            <Flex align="center" justify="space-between">
              <Flex.Item align="center" display="flex">
                <Flex.Item marginRight={2}>
                  <PoolFeeTag ammPool={position.pool} />
                </Flex.Item>
                {hasFarmForPool && (
                  <FarmsButton onClick={handleFarmsButtonClick} />
                )}
              </Flex.Item>
              <Button onClick={handleSwap} size="large" type="primary">
                <Trans>Swap</Trans>
              </Button>
            </Flex>
          </PageHeader>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <TotalLiquidity position={position} />
        </Flex.Item>
        <Flex.Item marginBottom={4} flex={1}>
          <MyLiquidity position={position} />
        </Flex.Item>
        <Flex.Item>
          <ConnectWalletButton
            width="100%"
            size="large"
            trace={{
              element_name: ElementName.connectWalletButton,
              element_location: ElementLocation.poolPosition,
            }}
          >
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
                  {s ? <Trans>Remove</Trans> : <Trans>Remove Liquidity</Trans>}
                </Button>
              </Flex.Item>
            </Flex>
          </ConnectWalletButton>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
