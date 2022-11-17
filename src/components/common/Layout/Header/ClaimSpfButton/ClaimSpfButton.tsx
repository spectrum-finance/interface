import { Button, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

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

export const ClaimSpfButton: FC = () => {
  const { width, height } = useWindowSize();
  const openClaimSpfModal = () => {
    Modal.open(() => <ClaimSpfModal />);
  };

  return (
    <>
      <Confetti width={width} height={height} />
      <StyledButton type="primary" size="large" onClick={openClaimSpfModal}>
        <TopBackgroundContainer>
          <TopBackground />
        </TopBackgroundContainer>
        <BottomBackgroundContainer>
          <BottomBackground />
        </BottomBackgroundContainer>
        <Trans>Claim SPF</Trans>
      </StyledButton>
    </>
  );
};
