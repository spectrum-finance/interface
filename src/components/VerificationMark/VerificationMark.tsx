import React from 'react';
import styled from 'styled-components';

import { ReactComponent as _VerificationIcon } from '../../assets/icons/verification-icon.svg';
import { Tooltip } from '../../ergodex-cdk';
import { IsErgo } from '../IsErgo/IsErgo';

const VerificationIcon = styled(_VerificationIcon)`
  cursor: pointer;
  color: var(--ergo-success-color);
  transition: 250ms ease;

  &:hover {
    color: var(--ergo-success-color-hover);
  }
`;

const VerificationMark = (): JSX.Element => {
  return (
    <IsErgo>
      <Tooltip title="This pool is verified by ErgoDEX">
        <VerificationIcon />
      </Tooltip>
    </IsErgo>
  );
};

export { VerificationMark };
