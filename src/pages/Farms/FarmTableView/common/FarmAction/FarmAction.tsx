import { Button, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { FarmActionModal } from '../../../FarmActionModal/FarmActionModal';

const FullWidthButton = styled(Button)`
  width: ${({ $fullWidth }: { $fullWidth?: boolean }) =>
    $fullWidth ? '100%' : 'normal'};
`;

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
    navigate(`../liquidity/${farm.ammPool.id}`);
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
      <Button type="primary" style={{ width: fullWidth ? '100%' : undefined }}>
        <Trans>Add liquidity</Trans>
      </Button>
    );
  }

  if (isWithdrawAvailable && isStakeAvailable) {
    return (
      <Button type="primary" style={{ width: fullWidth ? '100%' : undefined }}>
        <Trans>Manage</Trans>
      </Button>
    );
  }

  if (isStakeAvailable) {
    return (
      <Button
        type="primary"
        style={{ width: fullWidth ? '100%' : undefined }}
        onClick={() =>
          Modal.open(({ close }) => (
            <FarmActionModal operation="stake" pool={farm} onClose={close} />
          ))
        }
      >
        <Trans>Stake</Trans>
      </Button>
    );
  }

  if (isWithdrawAvailable) {
    return (
      <Button type="primary" style={{ width: fullWidth ? '100%' : undefined }}>
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
