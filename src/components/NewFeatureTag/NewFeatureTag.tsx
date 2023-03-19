import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface NewFeatureTagProps {
  children?: React.ReactNode;
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

interface SNewFeatureTagProps {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
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
  }
`;

export const NewFeatureTag = ({
  children,
  top,
  right,
  left,
  bottom,
}: NewFeatureTagProps): ReactElement => {
  return (
    <SNewFeatureTag top={top} right={right} left={left} bottom={bottom}>
      {children}
    </SNewFeatureTag>
  );
};
