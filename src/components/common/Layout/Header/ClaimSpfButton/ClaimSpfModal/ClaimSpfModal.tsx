import { Modal } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { spfReward$ } from '../../../../../../network/ergo/api/spfFaucet/spfReward';
import {
  SpfStatus,
  spfStatus$,
} from '../../../../../../network/ergo/api/spfFaucet/spfStatus';
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
  readonly firstClaim: boolean;
  readonly close: () => void;
}

export const ClaimSpfModal: FC<ClaimSpfModalProps> = ({
  firstClaim,
  close,
}) => {
  const [status] = useObservable(spfStatus$);
  const [reward] = useObservable(spfReward$);

  return (
    <>
      {status && reward && (
        <>
          <TopBackgroundContainer>
            <TopBackground />
          </TopBackgroundContainer>
          <BottomBackgroundContainer>
            <BottomBackground />
          </BottomBackgroundContainer>
          <Modal.Content width={480}>
            {status.status === SpfStatus.Init && (
              <ClaimRewardState reward={reward} />
            )}
            {status.status === SpfStatus.NothingToClaim && (
              <NothingToClaimState />
            )}
            {status.status === SpfStatus.Claimed && firstClaim && (
              <GotRewardState reward={reward} close={close} />
            )}
            {status.status === SpfStatus.Claimed && !firstClaim && (
              <AlreadyRewardState reward={reward} close={close} />
            )}
            {[SpfStatus.Pending, SpfStatus.WaitingConfirmation].includes(
              status.status,
            ) && <PendingState reward={reward} dateTime={status.dateTime} />}
          </Modal.Content>
        </>
      )}
    </>
  );
};
