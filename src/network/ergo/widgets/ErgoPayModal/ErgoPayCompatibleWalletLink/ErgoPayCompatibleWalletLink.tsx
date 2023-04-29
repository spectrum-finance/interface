import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as ExploreIcon } from '../../../../../assets/icons/icon-explore.svg';

const LinkText = styled(Typography.Title)`
  color: inherit !important;
  font-weight: 400 !important;
`;

export const ErgoPayCompatibleWalletLink: FC = () => (
  <Button
    type="link"
    href="https://ergoplatform.org/en/get-erg/#Wallets"
    target="_blank"
  >
    <Flex align="center">
      <Flex.Item marginRight={2}>
        <ExploreIcon />
      </Flex.Item>
      <LinkText level={4}>
        <Trans>Find compatible wallet</Trans>
      </LinkText>
    </Flex>
  </Button>
);
