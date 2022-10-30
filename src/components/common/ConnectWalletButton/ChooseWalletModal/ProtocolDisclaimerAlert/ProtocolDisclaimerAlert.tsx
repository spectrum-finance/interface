import { Box, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

const ProtocolDisclaimer = styled(Box)`
  .dark & {
    background: #111d2c;
    border-color: #15395b;
  }

  .light & {
    background: #e6f7ff;
    border-color: #91d5ff;
  }

  a {
    color: var(--spectrum-primary-color);

    &:hover {
      color: var(--spectrum-primary-color-hover);
    }

    &:active,
    &:focus {
      color: var(--spectrum-primary-color-active);
    }
  }
`;

export const ProtocolDisclaimerAlert: React.FC = () => {
  return (
    <ProtocolDisclaimer padding={[2, 4]} borderRadius="l">
      <Typography.Body size="small">
        <Trans>
          By connecting a wallet, you agree to the{' '}
          <a
            href="https://spectrum.fi/cookie-policy"
            target="_blank"
            rel="noreferrer"
          >
            Cookie policy
          </a>{' '}
          and acknowledge <br />
          that you have read and understand the{' '}
          <a
            href="https://spectrum.fi/protocol-disclaimer"
            target="_blank"
            rel="noreferrer"
          >
            Protocol disclaimer
          </a>
          .
        </Trans>
      </Typography.Body>
    </ProtocolDisclaimer>
  );
};
