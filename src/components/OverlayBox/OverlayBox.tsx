import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface OverlayBoxProps {
  readonly overlayed?: boolean;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly className?: string;
}

const Container = styled.div`
  position: relative;
`;

const _OverlayBox: FC<OverlayBoxProps> = ({ children, className }) => (
  <Container>
    {children}
    <div className={className} />
  </Container>
);

export const OverlayBox = styled(_OverlayBox)`
  bottom: 0;
  display: none;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  ${(props) =>
    props.overlayed &&
    css`
      background: var(--spectrum-box-bg);
      display: block;
      opacity: 0.8;
    `}
`;
