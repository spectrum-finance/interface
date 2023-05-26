import { FC } from 'react';
import styled from 'styled-components';

import PrismSrc from './prism.png';

const GlowContainer = styled.div`
  background: var(--spectrum-glow-gradient);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: -1;

  .background-image {
    background-image: var(--spectrum-glow-image);
    position: fixed;
    background-size: cover;
    top: 50%;
    width: var(--spectrum-glow-image-width);
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const Glow: FC = () => (
  <GlowContainer>
    <img src={PrismSrc} />
  </GlowContainer>
);
