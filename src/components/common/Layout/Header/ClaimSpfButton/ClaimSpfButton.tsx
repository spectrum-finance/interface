import { Button, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { claimSpfReward$ } from '../../../../../network/ergo/api/claimSpf/claimSpfReward';
import {
  ClaimSpfStatus,
  claimSpfStatus$,
} from '../../../../../network/ergo/api/claimSpf/claimSpfStatus';
import { ReactComponent as BottomBackground } from './bottom-background.svg';
import { ClaimSpfModal } from './ClaimSpfModal/ClaimSpfModal';
import { ReactComponent as TopBackground } from './top-background.svg';

const StyledButton = styled(Button)`
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

const FIRST_CLAIMED_EVENT_PASSED = 'FIRST_CLAIMED_EVENT';

export const ClaimSpfButton: FC = () => {
  const [claimSpfStatus] = useObservable(claimSpfStatus$);
  const [claimSpfReward] = useObservable(claimSpfReward$);
  const [confetti, setConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (
      claimSpfStatus?.status === ClaimSpfStatus.Claimed &&
      !localStorageManager.get(FIRST_CLAIMED_EVENT_PASSED)
    ) {
      setConfetti(true);
    }
  }, [claimSpfStatus]);

  useEffect(() => {
    if (confetti) {
      openClaimSpfModal();
    }
  }, [confetti]);

  const openClaimSpfModal = () => {
    Modal.open(
      ({ close }) => (
        <ClaimSpfModal
          reward={claimSpfReward!}
          status={claimSpfStatus!}
          firstClaim={confetti}
          close={close}
        />
      ),
      {
        afterClose: () => {
          if (confetti) {
            setConfetti(false);
            localStorageManager.set(FIRST_CLAIMED_EVENT_PASSED, true);
          }
        },
      },
    );
  };
  return (
    <>
      {confetti && <Confetti width={width} height={height} />}
      {claimSpfStatus && claimSpfReward && (
        <StyledButton type="primary" size="large" onClick={openClaimSpfModal}>
          <TopBackgroundContainer>
            <TopBackground />
          </TopBackgroundContainer>
          <BottomBackgroundContainer>
            <BottomBackground />
          </BottomBackgroundContainer>
          <Trans>Claim SPF</Trans>
        </StyledButton>
      )}
    </>
  );
};
