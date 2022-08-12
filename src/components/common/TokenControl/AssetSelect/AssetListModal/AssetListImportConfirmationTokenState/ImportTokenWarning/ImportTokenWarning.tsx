import { Flex, InfoCircleFilled } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

const StyledInfoCircleFilled = styled(InfoCircleFilled)`
  color: var(--spectrum-warning-color);
  font-size: 0.825rem;
`;

export const ImportTokenWarning: FC = () => (
  <Flex>
    <Flex.Item marginRight={2}>
      <StyledInfoCircleFilled />
    </Flex.Item>
    <Trans>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      This token doesn't appear on the active token list(s). Make sure this is
      the token that you want to trade.
    </Trans>
  </Flex>
);
