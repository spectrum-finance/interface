import { ReactElement } from 'react';
import * as React from 'react';
import styled from 'styled-components';

interface NewFeatureTagProps {
  children?: React.ReactNode;
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
  animate?: boolean;
}

interface SNewFeatureTagProps {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
  animate?: boolean;
}

const SNewFeatureTag = styled.div<SNewFeatureTagProps>`
  &::after {
    content: 'New';
    font-family: 'Vela Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    color: #ffffff;

    position: absolute;
    top: ${(p) => p.top}px;
    right: ${(p) => p.right}px;
    left: ${(p) => p.left}px;
    bottom: ${(p) => p.bottom}px;

    background: linear-gradient(
      71.04deg,
      #3b41c5 0%,
      #a981bb 49%,
      #ff7c32 100%
    );
    padding: 1px 4px;
    border-radius: 6px;

    z-index: 9999;

    animation: ${(p) => (p.animate ? 'pulse-orange 3s infinite' : '')};

    @keyframes pulse-orange {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(169, 129, 187, 0.7);
      }

      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(169, 129, 187, 0);
      }

      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
      }
    }
  }
`;

export const NewFeatureTag = ({
  children,
  top,
  right,
  left,
  bottom,
  animate = false,
}: NewFeatureTagProps): ReactElement => {
  return (
    <SNewFeatureTag
      top={top}
      right={right}
      left={left}
      bottom={bottom}
      animate={animate}
    >
      {children}
    </SNewFeatureTag>
  );
};
