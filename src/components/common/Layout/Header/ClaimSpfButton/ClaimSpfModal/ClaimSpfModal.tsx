import { Modal } from '@ergolabs/ui-kit';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as BottomBackground } from './bottom-backgroud.svg';
import { ClaimRewardState } from './ClainRewardState/ClaimRewardState';
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

enum ClaimSpfState {
  REWARD,
  PENDING,
}

export const ClaimSpfModal = () => {
  const [state] = useState(ClaimSpfState.PENDING);

  return (
    <>
      <TopBackgroundContainer>
        <TopBackground />
      </TopBackgroundContainer>
      <BottomBackgroundContainer>
        <BottomBackground />
      </BottomBackgroundContainer>
      <Modal.Content width={480}>
        {state === ClaimSpfState.REWARD && <ClaimRewardState />}
        {state === ClaimSpfState.PENDING && <PendingState />}
      </Modal.Content>
    </>
  );
};
