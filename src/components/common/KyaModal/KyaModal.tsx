import { Button, Flex, Modal, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { CSSProperties, useCallback } from 'react';

import { panalytics } from '../../../common/analytics';
import { useAppLoadingState } from '../../../context';

interface KyaModalProps {
  onClose: (isConfirmed: boolean) => void;
}

const KyaModal: React.FC<KyaModalProps> = ({ onClose }): JSX.Element => {
  const { valBySize } = useDevice();
  const [, setIsKyaAccepted] = useAppLoadingState();

  const handleConfirm = useCallback(() => {
    setIsKyaAccepted({ isKYAAccepted: true });
    panalytics.acceptKya();
    onClose(true);
  }, [setIsKyaAccepted, onClose]);
  return (
    <>
      <Modal.Title>Know Your Assumptions</Modal.Title>
      <Modal.Content
        width={valBySize<CSSProperties['width']>('100%', 680)}
        style={valBySize(
          { overflowY: 'auto', maxHeight: 'calc(80vh - 56px)' },
          {},
        )}
      >
        <Flex direction="col" className="kya-modal">
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              <Trans>
                ErgoDEX is a decentralized financial (DeFi) application which
                means it does not have a central government body. ErgoDEX
                includes AMM functionality (Swap, Add Liquidity and Remove
                Liquidity) on top of the Ergo and Cardano Blockchains.
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>
              <Trans>By accepting these KYA, you agree that:</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              <Trans>
                1. You will use the ErgoDEX product at your own peril and risk;
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              <Trans>2. Only YOU are responsible for your assets;</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              <Trans>3. ErgoDEX Smart Contracts meet your expectations.</Trans>
              {' ('}
              <Typography.Link
                href="https://github.com/ergolabs/ergo-dex"
                target="_blank"
              >
                Ergo-side contracts
              </Typography.Link>
              {', '}
              <Typography.Link
                href="https://github.com/ergolabs/cardano-dex-contracts"
                target="_blank"
              >
                Cardano-side contracts
              </Typography.Link>
              {')'}
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>
              <Trans>Notice that:</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              <Trans>
                - ErgoDEX operates on a live blockchain, thus trades are final,
                and irreversible once they have status &laquo;executed&raquo;;
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              <Trans>- Every transaction can be viewed via</Trans>{' '}
              <Typography.Link
                href="https://explorer.ergoplatform.com/"
                target="_blank"
              >
                <Trans>Ergo</Trans>
              </Typography.Link>{' '}
              <Trans>and</Trans>{' '}
              <Typography.Link
                href="https://explorer.cardano.org/en"
                target="_blank"
              >
                <Trans>Cardano Explorer</Trans>
              </Typography.Link>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              <Trans>
                - By creating an order you send your funds to a specific
                smart-contract, all such contracts are wired into the user
                interface. Thus, orders are created entirely in your browser (on
                your machine).
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>
              <Trans>
                ErgoDEX Team doesn’t guarantee the absence of bugs and errors.
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>
              <Trans>
                ErgoDEX offers a form of added security, as buyers and sellers
                do not have to give their information to any 3rd party. However,
                ErgoDEX is without a Know Your Customer (KYC) process and can
                offer NO assistance if a user is hacked or cheated out of
                passwords, currency or private wallet keys.
              </Trans>
            </Typography.Body>
          </Flex.Item>
        </Flex>
      </Modal.Content>
      <Modal.Content>
        <Button type="primary" size="large" block onClick={handleConfirm}>
          <Trans>I understand the risks and accept the KYA</Trans>
        </Button>
      </Modal.Content>
    </>
  );
};

export { KyaModal };
