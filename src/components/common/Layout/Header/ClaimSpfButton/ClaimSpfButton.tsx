import { Button, Modal, ModalRef } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { isWalletSetuped$ } from '../../../../../gateway/api/wallets';
import { spfReward$ } from '../../../../../network/ergo/api/spfFaucet/spfReward';
import {
  SpfStatus,
  spfStatus$,
} from '../../../../../network/ergo/api/spfFaucet/spfStatus';
import { ReactComponent as BottomBackground } from './bottom-background.svg';
import { ClaimSpfModal } from './ClaimSpfModal/ClaimSpfModal';
import { ClaimSpfNotification } from './ClaimSpfNotification/ClaimSpfNotification';
import { ReactComponent as TopBackground } from './top-background.svg';

const StyledButton = styled(Button)`
  cursor: pointer !important;
  overflow: hidden;
  position: relative;
`;

const TopBackgroundContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const BottomBackgroundContainer = styled.div`
  position: absolute;
  left: 0;
  top: -2px;
`;

const CLAIM_STAGE = 'CLAIM_STAGE';

export const ClaimSpfButton: FC = () => {
  const [claimSpfStatus] = useObservable(spfStatus$);
  const [claimSpfReward] = useObservable(spfReward$);
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const [confetti, setConfetti] = useState<boolean>(false);
  const [modalRef, setModalRef] = useState<ModalRef | undefined>();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (
      claimSpfStatus &&
      localStorageManager.get(CLAIM_STAGE) !== claimSpfStatus?.stage &&
      claimSpfStatus?.stage !== 1
    ) {
      setConfetti(true);
    }
  }, [claimSpfStatus]);

  useEffect(() => {
    if (!confetti || modalRef) {
      return;
    }
    openClaimSpfModal();
  }, [confetti]);

  const openClaimSpfModal = (e?: MouseEvent<any>) => {
    if (e) {
      e.stopPropagation();
    }
    const modalRef = Modal.open(
      ({ close }) => <ClaimSpfModal gotIt={confetti} close={close} />,
      {
        afterClose: () => {
          setModalRef(undefined);
          if (confetti) {
            setConfetti(false);
            localStorageManager.set(CLAIM_STAGE, claimSpfStatus?.stage);
          }
        },
      },
    );
    setModalRef(modalRef);
  };
  return (
    <>
      {confetti && isWalletConnected && (
        <Confetti width={width} height={height} />
      )}
      {claimSpfStatus && claimSpfReward && isWalletConnected && (
        <div onClick={openClaimSpfModal}>
          <StyledButton
            type="primary"
            size="large"
            loading={
              claimSpfStatus.status === SpfStatus.Pending ||
              claimSpfStatus.status === SpfStatus.WaitingConfirmation
            }
          >
            <TopBackgroundContainer>
              <TopBackground />
            </TopBackgroundContainer>
            <BottomBackgroundContainer>
              <BottomBackground />
            </BottomBackgroundContainer>
            {claimSpfStatus.status === SpfStatus.Pending ||
            claimSpfStatus.status === SpfStatus.WaitingConfirmation
              ? t`Claiming...`
              : t`Claim SPF`}
          </StyledButton>
          <ClaimSpfNotification
            reward={claimSpfReward}
            visible={claimSpfStatus.status === SpfStatus.Init}
            onClick={openClaimSpfModal}
          />
        </div>
      )}
    </>
  );
};
