import { Box, Button, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { LmPool, LmStatuses } from '../../../common/models/LmPool';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FarmActionModal } from '../FarmActionModal/FarmActionModal';

type Props = {
  lmPool: LmPool;
};

export const FarmAction = ({ lmPool }: Props) => {
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

  // if user has lp tokens

  if (lmPool.currentStatus === LmStatuses.SCHEDULED) {
    return (
      <Button type="primary" disabled>
        Stake
      </Button>
    );
  }

  if (lmPool.balanceVlq.isPositive()) {
    return (
      <Dropdown
        overlay={
          <Menu style={{ width: 160 }}>
            <Box secondary padding={2} borderRadius="l">
              <Menu.Item key={'item1'} onClick={openStakeModal}>
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
    );
  }

  if (lmPool.balanceLq.isPositive()) {
    return (
      <Button
        type="primary"
        onClick={(event) => {
          openStakeModal();
          event.stopPropagation();
        }}
      >
        Stake
      </Button>
    );
  }

  return <div>FarmAction</div>;
};
