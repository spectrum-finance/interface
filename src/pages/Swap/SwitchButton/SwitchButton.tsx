import { Button, ButtonProps } from '@ergolabs/ui-kit';
import React from 'react';
import styled from 'styled-components';

export type SwitchButtonProps = ButtonProps;

const _SwitchButton = ({ className, ...rest }: SwitchButtonProps) => (
  <div className={className}>
    <Button {...rest} />
  </div>
);

export const SwitchButton = styled(_SwitchButton)`
  position: relative;

  button {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: rotate(-90deg) translate(50%, -50%);
  }
`;
