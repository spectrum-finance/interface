import {
  Alert,
  Box,
  Button,
  Flex,
  InfoCircleFilled,
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
import { isDeprecatedPool } from '../../../common/utils/isDeprecatedPool';
import { normalizeAvailableLp } from '../../../common/utils/normalizeAvailableLp.ts';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { DeprecatedPoolTag } from '../../../components/DeprecatedPoolTag/DeprecatedPoolTag';
import { FarmsButton } from '../../../components/FarmsButton/FarmsButton';
import { LbspPoolTag } from '../../../components/LbspPoolTag/LbspPoolTag.tsx';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader';
import { redeem } from '../../../gateway/api/operations/redeem';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { isLbspPool } from '../../../network/cardano/api/lbspWhitelist/lbspWhitelist.ts';
import { hasFarmsForPool } from '../../../network/ergo/lm/api/farms/farms';
import { isSpfPool } from '../../../utils/lbsp.ts';
import { MyLiquidity } from './MyLiquidity/MyLiquidity';
import { PoolFeeTag } from './PoolFeeTag/PoolFeeTag';
import { TotalLiquidity } from './TotalLiquidity/TotalLiquidity';
import { ammTxFeeMapping } from "../../../network/cardano/api/operations/common/ammTxFeeMapping.ts";
import { transactionBuilder$ } from "../../../network/cardano/api/operations/common/transactionBuilder.ts";
import { switchMap, tap } from "rxjs";
import { AssetAmount } from "@spectrumlabs/cardano-dex-sdk";
import { DateTime } from "luxon";
import { localStorageManager } from "../../../common/utils/localStorageManager.ts";
import { CardanoSettings } from "../../../network/cardano/settings/settings.ts";
import { submitTx } from "../../../network/cardano/api/operations/common/submitTxCandidate.ts";

export interface PoolInfoProps {
  readonly position: Position;
}

export const PoolInfoView: FC<PoolInfoProps> = ({ position }) => {
  const { valBySize, s } = useDevice();
  const navigate = useNavigate();
  const [selectedNetwork] = useSelectedNetwork();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(position.pool.id), []);
  const [_isLbspPool] = useObservable(isLbspPool(position.pool.id));

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
                {isDeprecatedPool(position.pool.id) && (
                  <Flex.Item marginRight={2}>
                    <DeprecatedPoolTag />
                  </Flex.Item>
                )}
                {!s && (_isLbspPool || isSpfPool(position.pool.id)) && (
                  <LbspPoolTag isSpf={isSpfPool(position.pool.id)} />
                )}
                {hasFarmForPool && (
                  <FarmsButton onClick={handleFarmsButtonClick} />
                )}
              </Flex.Item>
              {!isDeprecatedPool(position.pool.id) &&
                !position.pool.unverified && (
                  <Button onClick={handleSwap} size="large" type="primary">
                    <Trans>Swap</Trans>
                  </Button>
                )}
            </Flex>
          </PageHeader>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <TotalLiquidity position={position} />
        </Flex.Item>
        <Flex.Item marginBottom={4} flex={1}>
          <MyLiquidity position={position} />
        </Flex.Item>
        {isDeprecatedPool(position.pool.id) && (
          <Flex.Item marginBottom={4}>
            <Alert
              type="warning"
              description={
                <Flex row>
                  <Flex.Item marginRight={2}>
                    <InfoCircleFilled
                      style={{ color: 'var(--spectrum-warning-color)' }}
                    />
                  </Flex.Item>
                  <Flex.Item>
                    <Trans>
                      A more secure variant of this pool is available. We advise
                      you to migrate your liquidity to a new one. Your LBSP
                      rewards won’t be affected.
                    </Trans>
                  </Flex.Item>
                </Flex>
              }
            />
          </Flex.Item>
        )}
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
                  onClick={() => {
                    transactionBuilder$
                      .pipe(
                        switchMap(tb => tb.lock({
                          lq: new AssetAmount(position.availableLp.percent(10).asset.data, position.availableLp.percent(10).amount),
                          lockedUntil: DateTime.now().plus({ hour: 1 }).toMillis(),
                          changeAddress: localStorageManager.get<CardanoSettings>('cardano-mainnet-settings')?.address!,
                          pk: localStorageManager.get<CardanoSettings>('cardano-mainnet-settings')?.ph!,
                          txFees: ammTxFeeMapping
                        })),
                      switchMap(([tx]) => submitTx(tx!))
                      ).subscribe(console.log)
                  }}
                  disabled={position.empty}
                  block
                >
                  Lock 10%
                </Button>
              </Flex.Item>
              <Flex.Item flex={1} marginRight={2}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    transactionBuilder$
                      .pipe(
                        switchMap(tb => tb.unlock({
                          redeemer: '719bee424a97b58b3dca88fe5da6feac6494aa7226f975f3506c5b25',
                          changeAddress: localStorageManager.get<CardanoSettings>('cardano-mainnet-settings')?.address!,
                          collateralAmount: 5000000n,
                          txFees: ammTxFeeMapping,
                          boxId: '7444e3e608bd1dffb685b8fed24ffc164e88d0f988a4243449b999abc4a24257:0'
                        })),
                        tap(console.log),
                        switchMap(([tx]) => submitTx(tx!, true))
                      ).subscribe(console.log, console.dir)
                  }}
                  disabled={position.empty}
                  block
                >
                  Unlock
                </Button>
              </Flex.Item>
              <Flex.Item flex={1} marginRight={2}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleAddLiquidity}
                  disabled={
                    applicationConfig.blacklistedPools.includes(
                      position.pool.id,
                    ) ||
                    isDeprecatedPool(position.pool.id) ||
                    position.pool.unverified
                  }
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
                  style={
                    isDeprecatedPool(position.pool.id) ||
                    position.pool.unverified
                      ? {
                          background: 'var(--spectrum-warning-color)',
                          borderColor: 'var(--spectrum-warning-color)',
                        }
                      : undefined
                  }
                  onClick={
                    isDeprecatedPool(position.pool.id) ||
                    position.pool.unverified
                      ? () => {
                          const [availableLp, availableX, availableY] =
                            normalizeAvailableLp(position);

                          redeem(
                            position.pool,
                            {
                              lpAmount: availableLp,
                              xAmount: availableX,
                              yAmount: availableY,
                              percent: 100,
                            },
                            true,
                          ).subscribe();
                        }
                      : handleRemovePositionClick
                  }
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
