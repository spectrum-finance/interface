import { Trans } from '@lingui/macro';
import React from 'react';

import { ReactComponent as SmartphoneImage } from '../../assets/images/smartphone.svg';
import { LANDING_URL } from '../../common/constants/env';
import { Button, Flex, Typography } from '../../ergodex-cdk';

const MobilePlug = (): JSX.Element => {
  return (
    <Flex justify="center">
      <Flex.Item marginTop={8}>
        <Flex direction="col" align="center">
          <Flex.Item marginBottom={4}>
            <SmartphoneImage style={{ color: 'var(--ergo-primary-color)' }} />
          </Flex.Item>
          <Flex.Item marginBottom={2}>
            <Typography.Title level={2}>
              <Trans>Mobile version is not supported yet</Trans>
            </Typography.Title>
          </Flex.Item>
          <Flex.Item marginBottom={8}>
            <Typography.Body>
              <Trans>Use the desktop version and Google Chrome browser</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Button type="primary" size="large" href={LANDING_URL}>
              <Trans>Back to Home</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export { MobilePlug };
