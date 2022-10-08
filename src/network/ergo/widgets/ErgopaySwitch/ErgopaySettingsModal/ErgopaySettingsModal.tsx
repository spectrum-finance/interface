import {
  Button,
  Flex,
  Input,
  Modal,
  Steps,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';

export interface ErgopaySettingsModalProps {
  readonly close: (address?: string) => void;
}

export const ErgopaySettingsModal: FC<ErgopaySettingsModalProps> = ({
  close,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [address, setAddress] = useState<string | undefined>();

  return (
    <>
      <Modal.Title>ErgoPay</Modal.Title>
      <Modal.Content width={480}>
        <Flex col>
          <Flex.Item marginBottom={8}>
            <Steps current={currentStep}>
              <Steps.Step key={0} />
              <Steps.Step key={1} />
            </Steps>
          </Flex.Item>
          {currentStep === 0 && (
            <>
              <Flex.Item marginBottom={6}>
                <Typography.Body>
                  <Trans>
                    Note that enabling Ergopay as a transaction signing method
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    won't allow using a browser extension wallet.
                    <br />
                    You can switch back at any time.
                  </Trans>
                </Typography.Body>
              </Flex.Item>
              <Flex.Item display="flex" justify="flex-end">
                <Flex.Item marginRight={2}>
                  <Button size="large" onClick={() => close()}>
                    Cancel
                  </Button>
                </Flex.Item>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => setCurrentStep(1)}
                >
                  Switch
                </Button>
              </Flex.Item>
            </>
          )}
          {currentStep === 1 && (
            <>
              <Flex.Item marginBottom={2}>
                <Typography.Body>
                  <Trans>
                    Add “Read Only” addresses to the interface to see your
                    balance and liquidity positions.
                  </Trans>
                </Typography.Body>
              </Flex.Item>
              <Flex.Item marginBottom={6}>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  size="large"
                />
              </Flex.Item>
              <Flex.Item display="flex" justify="flex-end">
                <Button
                  disabled={!address}
                  size="large"
                  type="primary"
                  onClick={() => close(address)}
                >
                  Add address
                </Button>
              </Flex.Item>
            </>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};
