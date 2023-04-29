import { Modal } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { spfReward$ } from '../../../../../../network/ergo/api/spfFaucet/spfReward';
import {
  LAST_STAGE,
  SpfStatus,
  spfStatus$,
} from '../../../../../../network/ergo/api/spfFaucet/spfStatus';
import { AlreadyRewardState } from './AlreadyRewardState/AlreadyRewardState';
import BottomBackground from './bottom-backgroud.svg';
import { ClaimRewardState } from './ClainRewardState/ClaimRewardState';
import { GotRewardState } from './GotRewardState/GotRewardState';
import { NothingToClaimState } from './NothingToClaimState/NothingToClaimState';
import { PendingState } from './PendingState/PendingState';
import TopBackground from './top-background.svg';

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
  readonly gotIt: boolean;
  readonly close: () => void;
}

export const ClaimSpfModal: FC<ClaimSpfModalProps> = ({ gotIt, close }) => {
  const [status] = useObservable(spfStatus$);
  const [reward] = useObservable(spfReward$);

  return (
    <>
      {status && reward && (
        <>
          <TopBackgroundContainer>
            <img src={TopBackground} />
          </TopBackgroundContainer>
          <BottomBackgroundContainer>
            <img src={BottomBackground} />
          </BottomBackgroundContainer>
          <Modal.Content width={480}>
            {gotIt && <GotRewardState reward={reward} close={close} />}
            {(status.status === SpfStatus.Init ||
              (status.status === SpfStatus.Claimed &&
                status.stage !== LAST_STAGE)) &&
              !gotIt && <ClaimRewardState reward={reward} status={status} />}
            {status.status === SpfStatus.NothingToClaim && !gotIt && (
              <NothingToClaimState close={close} />
            )}
            {status.status === SpfStatus.Claimed &&
              status.stage === LAST_STAGE &&
              !gotIt && <AlreadyRewardState reward={reward} close={close} />}
            {[SpfStatus.Pending, SpfStatus.WaitingConfirmation].includes(
              status.status,
            ) &&
              !gotIt && <PendingState reward={reward} status={status} />}
          </Modal.Content>
        </>
      )}
    </>
  );
};
