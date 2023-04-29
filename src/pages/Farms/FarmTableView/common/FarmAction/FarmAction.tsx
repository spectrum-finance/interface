import {
  Box,
  Button,
  ButtonProps,
  Dropdown,
  Menu,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { first } from 'rxjs';
import styled from 'styled-components';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { lmDeposit } from '../../../../../gateway/api/operations/lmDeposit';
import { lmRedeem } from '../../../../../gateway/api/operations/lmRedeem';
import { createFarmOperationModal } from '../../../FarmOperationModal/FarmOperationModal';

interface FarmActionProps {
  farm: Farm;
  fullWidth?: boolean;
  size?: ButtonProps['size'];
}

const StakeButton = styled(Button)``;
(StakeButton as any).__ANT_BUTTON = true;

const StakeMenuItem = styled(Menu.Item)``;
(StakeMenuItem as any).__ANT_BUTTON = true;

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

  const isStakeButtonDisabled = farm.expectedEpochsRemainForStake <= 1;

  if (farm.isTest && !isWithdrawAvailable) {
    return null;
  }

  if (farm.isTest && isWithdrawAvailable) {
    return (
      <Button
        size={size}
        type="primary"
        danger
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

  if (isWithdrawAvailable && (isStakeAvailable || isAddLiquidityAvailable)) {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown
          overlay={
            <Menu style={{ width: 160 }}>
              <Box transparent bordered={false} padding={2} borderRadius="l">
                {isStakeAvailable && (
                  <Tooltip
                    visible={isStakeButtonDisabled ? undefined : false}
                    title={t`The program is almost finished so deposits are closed.`}
                    width={200}
                  >
                    <StakeMenuItem
                      key={'item1'}
                      onClick={stake}
                      disabled={isStakeButtonDisabled}
                    >
                      <Trans>Stake</Trans>
                    </StakeMenuItem>
                  </Tooltip>
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
      <Tooltip
        visible={isStakeButtonDisabled ? undefined : false}
        title={t`The program is almost finished so deposits are closed.`}
        width={200}
      >
        <StakeButton
          onClick={(e) => {
            e.stopPropagation();
            stake();
          }}
          size={size}
          type="primary"
          width={fullWidth ? '100%' : undefined}
          disabled={isStakeButtonDisabled}
        >
          <Trans>Stake</Trans>
        </StakeButton>
      </Tooltip>
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
