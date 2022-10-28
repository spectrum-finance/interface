import { Button, Flex, message, Modal, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import styled from 'styled-components';

import { TxId } from '../../../../../common/types';
import {
  createErgoPayDeepLink,
  createUnsignedTxRequestLink,
} from '../common/ergopayLinks';

export interface ErgoPayTxInfoContentProps {
  readonly txId: TxId;
}

const FullWidthButton = styled(Button)`
  width: 100%;
`;

export const ErgoPayTxInfoContent: FC<ErgoPayTxInfoContentProps> = ({
  txId,
}) => {
  return (
    <>
      <Modal.Title>ErgoPay request</Modal.Title>
      <Modal.Content width={480}>
        <Flex col>
          <Flex.Item marginBottom={6}>
            <Typography.Body>
              <Trans>
                Complete the action with an ErgoPay compatible wallet.
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item alignSelf="center" marginBottom={6}>
            <Button
              type="link"
              href="https://ergoplatform.org/en/get-erg/#Wallets"
              target="_blank"
              rel="noreferrer"
            >
              <Trans>Find an ErgoPay compatible wallet</Trans>
            </Button>
          </Flex.Item>
          <Flex.Item marginBottom={2} alignSelf="center">
            <Typography.Body>
              <Trans>Scan QR code</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={6} alignSelf="center">
            <div
              style={{
                background: 'white',
                padding: '8px',
                borderRadius: 'var(--spectrum-border-radius-l)',
              }}
            >
              <QRCode size={128} value={createErgoPayDeepLink(createUnsignedTxRequestLink(txId))} />
            </div>
          </Flex.Item>
          <Flex.Item marginBottom={6} alignSelf="center">
            <Typography.Body>
              <Trans>or</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item display="flex" align="center" width="100%">
            <Flex.Item marginRight={2} flex={1}>
              <CopyToClipboard
                text={createErgoPayDeepLink(createUnsignedTxRequestLink(txId))}
                onCopy={() => message.success(t`Copied to clipboard!`)}
              >
                <FullWidthButton type="default" size="large">
                  <Trans>Copy request</Trans>
                </FullWidthButton>
              </CopyToClipboard>
            </Flex.Item>
            <Flex.Item flex={1}>
              <FullWidthButton
                type="primary"
                size="large"
                href={createErgoPayDeepLink(createUnsignedTxRequestLink(txId))}
              >
                <Trans>Open wallet</Trans>
              </FullWidthButton>
            </Flex.Item>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};
