import { Modal } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ClaimSpfReward } from '../../../../../../network/ergo/api/claimSpf/claimSpfReward';
import {
  ClaimSpfStatus,
  ClaimSpfStatusResponse,
} from '../../../../../../network/ergo/api/claimSpf/claimSpfStatus';
import { AlreadyRewardState } from './AlreadyRewardState/AlreadyRewardState';
import { ReactComponent as BottomBackground } from './bottom-backgroud.svg';
import { ClaimRewardState } from './ClainRewardState/ClaimRewardState';
import { GotRewardState } from './GotRewardState/GotRewardState';
import { NothingToClaimState } from './NothingToClaimState/NothingToClaimState';
import { PendingState } from './PendingState/PendingState';
import { ReactComponent as TopBackground } from './top-background.svg';

const TopBackgroundContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
`;

const BottomBackgroundContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: -6px;
`;

export interface ClaimSpfModalProps {
  readonly reward: ClaimSpfReward;
  readonly status: ClaimSpfStatusResponse;
  readonly firstClaim: boolean;
  readonly close: () => void;
}

export const ClaimSpfModal: FC<ClaimSpfModalProps> = ({
  reward,
  status,
  firstClaim,
  close,
}) => {
  return (
    <>
      <TopBackgroundContainer>
        <TopBackground />
      </TopBackgroundContainer>
      <BottomBackgroundContainer>
        <BottomBackground />
      </BottomBackgroundContainer>
      <Modal.Content width={480}>
        {status.status === ClaimSpfStatus.Init && (
          <ClaimRewardState reward={reward} />
        )}
        {status.status === ClaimSpfStatus.NothingToClaim && (
          <NothingToClaimState />
        )}
        {status.status === ClaimSpfStatus.Claimed && firstClaim && (
          <GotRewardState reward={reward} close={close} />
        )}
        {status.status === ClaimSpfStatus.Claimed && !firstClaim && (
          <AlreadyRewardState reward={reward} close={close} />
        )}
        {[ClaimSpfStatus.Pending, ClaimSpfStatus.WaitingConfirmation].includes(
          status.status,
        ) && <PendingState reward={reward} dateTime={status.dateTime} />}
      </Modal.Content>
    </>
  );
};
