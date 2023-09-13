import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

import SnekImg1 from './snek-img-1.png';
import SnekImg2 from './snek-img-2.png';

const snekAnimation = keyframes`
  0% {
    transform: rotate(1deg);
  }
  50% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(1deg);
  }
`;

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
    position: absolute;
    background-size: cover;
    top: 50%;
    height: 100%;
    width: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
  }

  .snek-theme-images {
    display: none;

    .img-1 {
      position: absolute;
      left: -60px;
      top: 60px;
      width: 60%;
      min-width: 300px;
      max-width: 200px;
      z-index: 3;
    }

    .img-2 {
      position: absolute;
      left: -60px;
      top: 60px;
      width: 60%;
      min-width: 300px;
      max-width: 200px;
      z-index: 2;
      animation: ${snekAnimation} 5s linear infinite;
    }
  }
`;

export const Glow: FC = () => (
  <GlowContainer>
    <div className="snek-theme-images">
      <img className="img-1" src={SnekImg1} alt="snek" />
      <img className="img-2" src={SnekImg2} alt="snek" />
    </div>
    <div className="background-image" />
  </GlowContainer>
);
