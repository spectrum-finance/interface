import { Box, Button, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import { matchPath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { LmPool, LmStatuses } from '../../../common/models/LmPool';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { selectedNetwork$ } from '../../../gateway/common/network';
import { FarmActionModal } from '../FarmActionModal/FarmActionModal';

type Props = {
  lmPool: LmPool;
  $fullWidth?: boolean;
};

const FullWidthButton = styled(Button)`
  width: ${({ $fullWidth }: { $fullWidth?: boolean }) =>
    $fullWidth ? '100%' : 'normal'};
`;

export const FarmAction = ({ lmPool, $fullWidth = false }: Props) => {
  const navigate = useNavigate();
  const urlNetworkParameter = matchPath(
    { path: ':network', end: false },
    location.pathname,
  )?.params?.network;

  const openStakeModal = () => {
    openConfirmationModal(
      (next) => {
        return (
          <FarmActionModal operation="stake" pool={lmPool} onClose={() => {}} />
        );
      },
      Operation.STAKE_LIQUIDITY_FARM,
      { xAsset: lmPool.ammPool.x, yAsset: lmPool.ammPool.y },
    );
  };

  const openWithdrawalModal = () => {
    openConfirmationModal(
      (next) => {
        return (
          <FarmActionModal
            operation="withdrawal"
            pool={lmPool}
            onClose={() => {}}
          />
        );
      },
      Operation.STAKE_LIQUIDITY_FARM,
      { xAsset: lmPool.ammPool.x, yAsset: lmPool.ammPool.y },
    );
  };

  const navigateToAddLiquidity = () => {
    navigate(`/${urlNetworkParameter}/liquidity/add`);
  };

  if (lmPool.currentStatus === LmStatuses.SCHEDULED) {
    if (!lmPool.balanceLq.isPositive()) {
      return (
        <FullWidthButton
          $fullWidth={$fullWidth}
          type="primary"
          onClick={navigateToAddLiquidity}
        >
          <Trans>Add liquidity</Trans>
        </FullWidthButton>
      );
    }

    return (
      <FullWidthButton $fullWidth={$fullWidth} type="primary" disabled>
        <Trans>Stake</Trans>
      </FullWidthButton>
    );
  }

  if (lmPool.balanceVlq.isPositive()) {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown
          overlay={
            <Menu style={{ width: 160 }}>
              <Box secondary padding={2} borderRadius="l">
                <Menu.Item
                  key={'item1'}
                  onClick={openStakeModal}
                  disabled={lmPool.currentStatus === LmStatuses.FINISHED}
                >
                  <Trans>Stake</Trans>
                </Menu.Item>

                <Menu.Item key={'item1'} onClick={openWithdrawalModal}>
                  <Trans>Withdraw</Trans>
                </Menu.Item>
              </Box>
            </Menu>
          }
          trigger={['click']}
          placement="bottomCenter"
        >
          <FullWidthButton
            $fullWidth={$fullWidth}
            type="primary"
            size={'middle'}
            onClick={(event) => event.stopPropagation()}
          >
            <Trans>Manage</Trans>
          </FullWidthButton>
        </Dropdown>
      </div>
    );
  }

  if (!lmPool.balanceLq.isPositive()) {
    return (
      <FullWidthButton
        $fullWidth={$fullWidth}
        type="primary"
        onClick={navigateToAddLiquidity}
      >
        <Trans>Add liquidity</Trans>
      </FullWidthButton>
    );
  }

  return (
    <FullWidthButton
      $fullWidth={$fullWidth}
      type="primary"
      onClick={(event) => {
        openStakeModal();
        event.stopPropagation();
      }}
      disabled={lmPool.currentStatus === LmStatuses.FINISHED}
    >
      <Trans>Stake</Trans>
    </FullWidthButton>
  );
};
