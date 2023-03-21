import { Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

const FaucetModal: React.FC = () => {
  return (
    <>
      <Modal.Title>
        <Trans>Get ADA for testing</Trans>
      </Modal.Title>
      <Modal.Content width={470}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Typography.Body>
              <Trans>
                To get testnet ADA coins (tADA) go to the official{' '}
                <Typography.Link
                  href="https://testnets.cardano.org/en/testnets/cardano/tools/faucet/"
                  target="_black"
                >
                  Cardano Faucet
                </Typography.Link>
              </Trans>
            </Typography.Body>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { FaucetModal };
