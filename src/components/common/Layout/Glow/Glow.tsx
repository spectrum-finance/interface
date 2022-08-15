import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as Prism } from './prism.svg';

const GlowContainer = styled.div`
  background: var(--spectrum-glow-gradient);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: -1;

  svg {
    position: absolute;
    top: 30px;
    max-width: 839px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const Glow: FC = () => (
  <GlowContainer>
    <Prism />
  </GlowContainer>
);
