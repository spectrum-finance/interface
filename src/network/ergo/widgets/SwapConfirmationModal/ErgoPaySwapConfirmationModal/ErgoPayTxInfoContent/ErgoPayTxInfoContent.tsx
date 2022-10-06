import { Button, Flex, message, Modal, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';

import { applicationConfig } from '../../../../../../applicationConfig';
import { TxId } from '../../../../../../common/types';

export interface ErgoPayTxInfoContentProps {
  readonly txId: TxId;
}

const createRequestLink = (txId: TxId): string =>
  `${applicationConfig.networksSettings.ergo.ergopayUrl}unsignedTx/${txId}`;

const createDeepLink = (txId: TxId): string =>
  createRequestLink(txId).replace('https', 'ergopay');

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
          <Flex.Item marginBottom={2} alignSelf="center">
            <QRCode size={128} value={createDeepLink(txId)} />
          </Flex.Item>
          <Flex.Item marginBottom={6} alignSelf="center">
            <Typography.Body>
              <Trans>or</Trans>
            </Typography.Body>
          </Flex.Item>
          <CopyToClipboard
            text={createRequestLink(txId)}
            onCopy={() => message.success(t`Copied to clipboard!`)}
          >
            <Button type="default" size="large">
              <Trans>Copy request</Trans>
            </Button>
          </CopyToClipboard>
        </Flex>
      </Modal.Content>
    </>
  );
};
