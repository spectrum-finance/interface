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
import {
  EventProducerContext,
  fireOperationAnalyticsEvent,
} from '../../../../../gateway/analytics/fireOperationAnalyticsEvent.ts';
import { lmDeposit } from '../../../../../gateway/api/operations/lmDeposit';
import { lmRedeem } from '../../../../../gateway/api/operations/lmRedeem';
import { mapToFarmAnalyticsProps } from '../../../../../utils/analytics/mapper.ts';
import { createFarmOperationModal } from '../../../FarmOperationModal/FarmOperationModal';

interface FarmActionProps {
  farm: Farm;
  fullWidth?: boolean;
  size?: ButtonProps['size'];
}

enum AnalyticsFarmButtonRenderingTypes {
  DEFAULT,
  MANAGE,
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

  const navigateToAddLiquidity = (type: AnalyticsFarmButtonRenderingTypes) => {
    navigate(`../liquidity/${farm.ammPool.id}/add`);
    if (type === AnalyticsFarmButtonRenderingTypes.DEFAULT) {
      fireOperationAnalyticsEvent(
        'Farm Click Add Liquidity',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    } else if (type === AnalyticsFarmButtonRenderingTypes.MANAGE) {
      fireOperationAnalyticsEvent(
        'Farm Click Manage Add Liquidity',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    }
  };

  const stake = (type: AnalyticsFarmButtonRenderingTypes) => {
    lmDeposit(farm, createFarmOperationModal(farm, 'stake'))
      .pipe(first())
      .subscribe();
    if (type === AnalyticsFarmButtonRenderingTypes.DEFAULT) {
      fireOperationAnalyticsEvent(
        'Farm Click Stake',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    } else if (type === AnalyticsFarmButtonRenderingTypes.MANAGE) {
      fireOperationAnalyticsEvent(
        'Farm Click Manage Stake',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    }
  };

  const withdraw = (type: AnalyticsFarmButtonRenderingTypes) => {
    lmRedeem(farm, createFarmOperationModal(farm, 'unstake'))
      .pipe(first())
      .subscribe();
    if (type === AnalyticsFarmButtonRenderingTypes.DEFAULT) {
      fireOperationAnalyticsEvent(
        'Farm Click Unstake',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    } else if (type === AnalyticsFarmButtonRenderingTypes.MANAGE) {
      fireOperationAnalyticsEvent(
        'Farm Click Manage Unstake',
        (ctx: EventProducerContext) => mapToFarmAnalyticsProps(farm, ctx),
      );
    }
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
          withdraw(AnalyticsFarmButtonRenderingTypes.DEFAULT);
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
                      onClick={() =>
                        stake(AnalyticsFarmButtonRenderingTypes.MANAGE)
                      }
                      disabled={isStakeButtonDisabled}
                    >
                      <Trans>Stake</Trans>
                    </StakeMenuItem>
                  </Tooltip>
                )}
                {isAddLiquidityAvailable && (
                  <Menu.Item
                    key={'item3'}
                    onClick={() =>
                      navigateToAddLiquidity(
                        AnalyticsFarmButtonRenderingTypes.MANAGE,
                      )
                    }
                  >
                    <Trans>Add liquidity</Trans>
                  </Menu.Item>
                )}

                <Menu.Item
                  key={'item2'}
                  onClick={() =>
                    withdraw(AnalyticsFarmButtonRenderingTypes.MANAGE)
                  }
                >
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
        onClick={() =>
          navigateToAddLiquidity(AnalyticsFarmButtonRenderingTypes.DEFAULT)
        }
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
            stake(AnalyticsFarmButtonRenderingTypes.DEFAULT);
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
          withdraw(AnalyticsFarmButtonRenderingTypes.DEFAULT);
        }}
      >
        <Trans>Unstake</Trans>
      </Button>
    );
  }

  return null;
};
