import { Box, Button, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { first } from 'rxjs';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { lmDeposit } from '../../../../../gateway/api/operations/lmDeposit';
import { lmRedeem } from '../../../../../gateway/api/operations/lmRedeem';
import { createFarmOperationModal } from '../../../FarmOperationModal/FarmOperationModal';

interface FarmActionProps {
  farm: Farm;
  fullWidth?: boolean;
}

export const FarmAction: FC<FarmActionProps> = ({
  farm,
  fullWidth = false,
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

  const isAddLiquidityAvailable =
    !farm.availableToStakeLq.isPositive() &&
    !farm.yourStakeLq.isPositive() &&
    farm.status !== FarmStatus.Finished;

  const isStakeAvailable =
    farm.availableToStakeLq.isPositive() && farm.status !== FarmStatus.Finished;

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

  if (isWithdrawAvailable && isStakeAvailable) {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown
          overlay={
            <Menu style={{ width: 160 }}>
              <Box transparent bordered={false} padding={2} borderRadius="l">
                <Menu.Item key={'item1'} onClick={stake}>
                  <Trans>Stake</Trans>
                </Menu.Item>

                <Menu.Item key={'item1'} onClick={withdraw}>
                  <Trans>Withdraw</Trans>
                </Menu.Item>
              </Box>
            </Menu>
          }
          trigger={['click']}
          placement="bottomCenter"
        >
          <Button type="primary" width={fullWidth ? '100%' : undefined}>
            <Trans>Manage</Trans>
          </Button>
        </Dropdown>
      </div>
    );
  }

  if (isStakeAvailable) {
    return (
      <Button
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
        type="primary"
        width={fullWidth ? '100%' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          withdraw();
        }}
      >
        <Trans>Withdraw</Trans>
      </Button>
    );
  }

  return null;

  // if (farm.status === LmPoolStatus.Finished) {
  //   return farm.yourStakeLq.isPositive() ? (
  //     <Button type="primary">
  //       <Trans>Withdraw</Trans>
  //     </Button>
  //   ) : null;
  // }
  //
  // if (!farm.availableToStakeLq.isPositive()) return null;

  // if (farm.status === LmPoolStatus.Scheduled) {
  //   if (!farm.availableToStakeLq.isPositive()) {
  //     return (
  //       <FullWidthButton
  //         $fullWidth={fullWidth}
  //         type="primary"
  //         onClick={navigateToAddLiquidity}
  //       >
  //         <Trans>Add liquidity</Trans>
  //       </FullWidthButton>
  //     );
  //   }
  //
  //   return (
  //     <FullWidthButton
  //       $fullWidth={fullWidth}
  //       type="primary"
  //       onClick={(event) => {
  //         event.stopPropagation();
  //       }}
  //     >
  //       <Trans>Stake</Trans>
  //     </FullWidthButton>
  //   );
  // }
  //
  // if (farm.yourStakeLq.isPositive()) {
  //   return (
  //     <div onClick={(event) => event.stopPropagation()}>
  //       <Dropdown
  //         overlay={
  //           <Menu style={{ width: 160 }}>
  //             <Box secondary padding={2} borderRadius="l">
  //               <Menu.Item
  //                 key={'item1'}
  //                 disabled={farm.status === LmPoolStatus.Finished}
  //               >
  //                 <Trans>Stake</Trans>
  //               </Menu.Item>
  //
  //               <Menu.Item key={'item1'}>
  //                 <Trans>Withdraw</Trans>
  //               </Menu.Item>
  //             </Box>
  //           </Menu>
  //         }
  //         trigger={['click']}
  //         placement="bottomCenter"
  //       >
  //         <FullWidthButton
  //           $fullWidth={fullWidth}
  //           type="primary"
  //           size={'middle'}
  //           onClick={(event) => event.stopPropagation()}
  //         >
  //           <Trans>Manage</Trans>
  //         </FullWidthButton>
  //       </Dropdown>
  //     </div>
  //   );
  // }
  //
  // if (!farm.availableToStakeLq.isPositive()) {
  //   return (
  //     <FullWidthButton
  //       $fullWidth={fullWidth}
  //       type="primary"
  //       onClick={navigateToAddLiquidity}
  //     >
  //       <Trans>Add liquidity</Trans>
  //     </FullWidthButton>
  //   );
  // }
  //
  // return (
  //   <FullWidthButton
  //     $fullWidth={fullWidth}
  //     type="primary"
  //     onClick={(event) => {
  //       event.stopPropagation();
  //     }}
  //     disabled={farm.status === LmPoolStatus.Finished}
  //   >
  //     <Trans>Stake</Trans>
  //   </FullWidthButton>
  // );
};
