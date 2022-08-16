import { Button, Flex, Modal, ModalRef, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as Arrow } from './arrow.svg';
import { ReactComponent as ErgodexLogo } from './ergodex-logo.svg';
import { ReactComponent as SpectrumLogo } from './spectrum-logo.svg';

const StyledArrow = styled(Arrow)`
  color: var(--spectrum-alert-close-color);
`;

const StyledErgodexLogo = styled(ErgodexLogo)`
  color: var(--spectrum-primary-text);
`;

const StyledSpectrumLogo = styled(SpectrumLogo)`
  color: var(--spectrum-primary-text);
`;

export const RebrandingModal: FC<ModalRef> = ({ close }) => (
  <>
    <Modal.Title>
      <Flex justify="center">
        <Trans>We have changed the brand!</Trans>
      </Flex>
    </Modal.Title>
    <Modal.Content width={420}>
      <Flex col>
        <Flex.Item
          display="flex"
          justify="center"
          align="center"
          marginBottom={4}
        >
          <StyledErgodexLogo />
          <Flex.Item marginRight={4} marginLeft={4}>
            <StyledArrow />
          </Flex.Item>
          <StyledSpectrumLogo />
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Typography.Body align="center">
            <Trans>
              Hey! If you missed it, our DEX has moved on and become even
              better! Now it’s called Spectrum.DEX. We will not just be a DEX
              anymore, but a native cross-chain ecosystem with new products.
              Stay tuned and join our socials!
            </Trans>
          </Typography.Body>
        </Flex.Item>
        <Button size="extra-large" type="primary" onClick={close}>
          <Trans>Awesome!</Trans>
        </Button>
      </Flex>
    </Modal.Content>
  </>
);
