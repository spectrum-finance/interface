import { Box, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

const ProtocolDisclaimer = styled(Box)`
  border: 1px solid var(--spectrum-default-border-color);
  font-size: 12px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin-bottom: 8px;

  .dark & {
    background: #15395b;

    color: #dbdbdb;
    a {
      color: #7167c5;
    }
  }
`;
export const ProtocolDisclaimeralert: React.FC = () => {
  return (
    <ProtocolDisclaimer padding={2}>
      <Flex col>
        <Flex.Item>
          <Trans>
            By connecting a wallet, you agree to the{' '}
            <a href="https://spectrum.fi/cookie-policy">Cookie policy</a> and
            acknowledge that you have read and understand the{' '}
            <a href="https://spectrum.fi/protocol-disclaimer">
              Protocol disclaimer
            </a>
            .
          </Trans>
        </Flex.Item>
      </Flex>
    </ProtocolDisclaimer>
  );
};
