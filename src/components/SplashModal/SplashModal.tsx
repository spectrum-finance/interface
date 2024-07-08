import { Button, Flex, Modal, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { CSSProperties } from 'react';
import * as React from 'react';

export const SplashModal: React.FC<{ close: (result?: any) => void }> = ({
  close,
}) => {
  const { valBySize } = useDevice();

  const handleClick = () => {
    window.open('https://app.splash.trade', '_blank');
    close();
  };

  return (
    <>
      <Modal.Title>
        <Typography.Title level={3}>Product Update</Typography.Title>
      </Modal.Title>
      <Modal.Content width={valBySize<CSSProperties['width']>('100%', 480)}>
        <Flex col gap={4}>
          <Typography.Body>
            Spectrum Cardano DEX will change its brand name to Splash soon.
            <br />
            All pools will be migrated to the Splash interface.
            <br />
            Funds will be accessible through the new interface.
          </Typography.Body>
          <Typography.Body strong>
            This interface will be shut down on 1st Aug 2024.
          </Typography.Body>
          <Flex justify="center">
            <Button
              type="primary"
              size="large"
              width={'130px'}
              onClick={handleClick}
            >
              <Trans>Go to Splash</Trans>
            </Button>
          </Flex>
        </Flex>
      </Modal.Content>
    </>
  );
};
