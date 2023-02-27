import { Box, Button, ButtonProps, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { first } from 'rxjs';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { lmDeposit } from '../../../../../gateway/api/operations/lmDeposit';
import { lmRedeem } from '../../../../../gateway/api/operations/lmRedeem';
import { createFarmOperationModal } from '../../../FarmOperationModal/FarmOperationModal';

interface FarmActionProps {
  farm: Farm;
  fullWidth?: boolean;
  size?: ButtonProps['size'];
}

export const FarmAction: FC<FarmActionProps> = ({
  farm,
  fullWidth = false,
  size,
}) => {
  const navigate = useNavigate();

  const navigateToAddLiquidity = () => {
    navigate(`../liquidity/${farm.ammPool.id}/add`);
  };

  const stake = () => {
    lmDeposit(farm, createFarmOperationModal(farm, 'stake'))
      .pipe(first())
      .subscribe();
  };

  const withdraw = () => {
    lmRedeem(farm, createFarmOperationModal(farm, 'withdrawal'))
      .pipe(first())
      .subscribe();
  };

  const isWithdrawAvailable = farm.yourStakeLq.isPositive();

  const isStakeAvailable =
    farm.availableToStakeLq.isPositive() && farm.status !== FarmStatus.Finished;

  const isAddLiquidityAvailable =
    !isStakeAvailable && farm.status !== FarmStatus.Finished;

  if (isWithdrawAvailable && (isStakeAvailable || isAddLiquidityAvailable)) {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown
          overlay={
            <Menu style={{ width: 160 }}>
              <Box transparent bordered={false} padding={2} borderRadius="l">
                {isStakeAvailable && (
                  <Menu.Item key={'item1'} onClick={stake}>
                    <Trans>Stake</Trans>
                  </Menu.Item>
                )}
                {isAddLiquidityAvailable && (
                  <Menu.Item key={'item3'} onClick={navigateToAddLiquidity}>
                    <Trans>Add liquidity</Trans>
                  </Menu.Item>
                )}

                <Menu.Item key={'item2'} onClick={withdraw}>
                  <Trans>Unstake</Trans>
                </Menu.Item>
              </Box>
            </Menu>
          }
          trigger={['click']}
          placement="bottomCenter"
        >
          <Button
            size={size}
            type="primary"
            width={fullWidth ? '100%' : undefined}
          >
            <Trans>Manage</Trans>
          </Button>
        </Dropdown>
      </div>
    );
  }

  if (isAddLiquidityAvailable) {
    return (
      <Button
        type="primary"
        width={fullWidth ? '100%' : undefined}
        onClick={navigateToAddLiquidity}
      >
        <Trans>Add liquidity</Trans>
      </Button>
    );
  }

  if (isStakeAvailable) {
    return (
      <Button
        size={size}
        type="primary"
        width={fullWidth ? '100%' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          stake();
        }}
      >
        <Trans>Stake</Trans>
      </Button>
    );
  }

  if (isWithdrawAvailable) {
    return (
      <Button
        size={size}
        type="primary"
        width={fullWidth ? '100%' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          withdraw();
        }}
      >
        <Trans>Unstake</Trans>
      </Button>
    );
  }

  return null;
};
