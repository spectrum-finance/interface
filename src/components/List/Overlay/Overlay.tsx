import { FC } from 'react';
import styled, { css } from 'styled-components';

export type OverlayPosition = 'bottom' | 'top';

export interface OverlayProps {
  readonly className?: string;
  readonly position: OverlayPosition;
}

const _Overlay: FC<OverlayProps> = ({ className }) => (
  <div className={className} />
);

export const Overlay = styled(_Overlay)`
  background-attachment: fixed;
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-focus: none;
  user-select: none;
  transition: opacity 0.2s, background 0.2s;
  visibility: hidden;

  ${(props) =>
    props.position === 'bottom' &&
    css`
      background: linear-gradient(
        180deg,
        rgba(20, 20, 20, 0) 66.92%,
        #141414 100%
      );
      visibility: visible;
    `}

  ${(props) =>
    props.position === 'top' &&
    css`
      background: linear-gradient(
        180deg,
        rgba(20, 20, 20, 0) 66.92%,
        #141414 100%
      );
      visibility: visible;
      transform: rotate(-180deg);
    `}
`;
