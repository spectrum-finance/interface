import { Button, Flex, Modal, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { CSSProperties } from 'react';
import * as React from 'react';

export const PreSplashModal: React.FC<{ close: (result?: any) => void }> = ({
  close,
}) => {
  const { valBySize } = useDevice();

  const handleClick = () => {
    window.open('https://pre-splash-app.spectrum.fi/SPLASH-ADA', '_blank');
    close();
  };

  return (
    <>
      <Modal.Title>
        <Typography.Title level={3}>Try new interface</Typography.Title>
      </Modal.Title>
      <Modal.Content width={valBySize<CSSProperties['width']>('100%', 480)}>
        <Flex col gap={4}>
          <Typography.Body>
            Spectrum DEX will become Splash soon. Try a new Pre-Splash Interface
            and meet even faster trading experience.
          </Typography.Body>
          <Typography.Body strong>
            To trade SPLASH token use the new Interface as well.
          </Typography.Body>
          <Button type="primary" size="large" width={100} onClick={handleClick}>
            <Trans>Try now</Trans>
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};
