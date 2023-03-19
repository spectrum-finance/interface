import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface NewFeatureTagProps {
  children?: React.ReactNode;
  top?: number;
  right?: number;
}

interface SNewFeatureTagProps {
  top?: number;
  right?: number;
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

    background: linear-gradient(
      71.04deg,
      #3b41c5 0%,
      #a981bb 49%,
      #ff7c32 100%
    );
    padding: 1px 4px;
    border-radius: 6px;
  }
`;

export const NewFeatureTag = ({
  children,
  top,
  right,
}: NewFeatureTagProps): ReactElement => {
  return (
    <SNewFeatureTag top={top} right={right}>
      {children}
    </SNewFeatureTag>
  );
};
