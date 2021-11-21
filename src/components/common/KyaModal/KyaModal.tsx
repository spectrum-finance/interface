import React, { useCallback } from 'react';

import { useAppLoadingState } from '../../../context';
import { Button, Modal, Typography } from '../../../ergodex-cdk';
import { Flex } from '../../../ergodex-cdk';

interface KyaModalProps {
  onClose: () => void;
}

const KyaModal: React.FC<KyaModalProps> = ({ onClose }): JSX.Element => {
  const [, setIsKyaAssepted] = useAppLoadingState();

  const handleConfirm = useCallback(() => {
    setIsKyaAssepted({ isKYAAccepted: true });
    onClose();
  }, [setIsKyaAssepted, onClose]);
  return (
    <>
      <Modal.Title>Know Your Assumptions</Modal.Title>
      <Modal.Content width={680}>
        <Flex flexDirection="col" className="kya-modal">
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              ErgoDEX is a decentralized financial (DeFi) application which
              means it doesn’t have a central government body. ErgoDEX includes
              AMM (Swap, Add liquidity and Remove liquidity) functionality{' '}
              <Typography.Body strong>
                only on top of the Ergo Blockchain.
              </Typography.Body>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>
              By accepting these KYA, you agree that:
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              1. You will use the product at your own peril and risk;
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              2. Only YOU are responsible for your assets;
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              3.{' '}
              <Button
                type="link"
                style={{ padding: '0', lineHeight: '16px', height: '100%' }}
                href="https://github.com/ergolabs/ergo-dex"
                target="_blank"
                rel="noreferrer"
              >
                ErgoDEX Smart Contracts
              </Button>{' '}
              meet your expectations.
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>Notice that:</Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              - ErgoDEX operates on a live blockchain, thus trades are final,
              and irreversible once they have status &laquo;executed&raquo;;
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              - Every transaction can be viewed via{' '}
              <Button
                type="link"
                style={{ padding: '0', lineHeight: '16px', height: '100%' }}
                href="https://explorer.ergoplatform.com/en/"
                target="_blank"
                rel="noreferrer"
              >
                explorer
              </Button>
              ;
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              - By creating an order you send your funds to a specific
              smart-contract, all such contracts are wired into the UI. Thus,
              orders are created entirely in your browser (on your machine).
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>
              ErgoDEX Team doesn’t guarantee the absence of bugs and errors.
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>
              ErgoDEX offers a form of added security, as buyers and sellers do
              not have to give their information to any 3rd party. However,
              ErgoDEX is without a know your customer (KYC) process and can
              offer NO assistance if a user is hacked or cheated out of
              passwords, currency or private wallet keys.
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>
              We recommend that you DO NOT use ErgoDEX to operate large amounts
              of assets!
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Button type="primary" size="large" block onClick={handleConfirm}>
              I understand the risks and accept the KYA
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { KyaModal };
