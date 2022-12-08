import { Box, Button, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import { matchPath, useNavigate } from 'react-router-dom';

import { LmPool, LmStatuses } from '../../../common/models/LmPool';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { selectedNetwork$ } from '../../../gateway/common/network';
import { FarmActionModal } from '../FarmActionModal/FarmActionModal';

type Props = {
  lmPool: LmPool;
};

export const FarmAction = ({ lmPool }: Props) => {
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
        <Button type="primary" onClick={navigateToAddLiquidity}>
          <Trans>Add liquidity</Trans>
        </Button>
      );
    }

    return (
      <Button type="primary" disabled>
        <Trans>Stake</Trans>
      </Button>
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
          <Button
            type="primary"
            size={'middle'}
            onClick={(event) => event.stopPropagation()}
          >
            <Trans>Manage</Trans>
          </Button>
        </Dropdown>
      </div>
    );
  }

  if (!lmPool.balanceLq.isPositive()) {
    return (
      <Button type="primary" onClick={navigateToAddLiquidity}>
        <Trans>Add liquidity</Trans>
      </Button>
    );
  }

  return (
    <Button
      type="primary"
      onClick={(event) => {
        openStakeModal();
        event.stopPropagation();
      }}
    >
      <Trans>Stake</Trans>
    </Button>
  );
};
