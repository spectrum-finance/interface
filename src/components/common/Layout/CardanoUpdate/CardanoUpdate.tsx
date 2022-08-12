import { Button, Flex, ToolOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { applicationConfig } from '../../../../applicationConfig';
import { changeSelectedNetwork } from '../../../../gateway/common/network';
import { ergoNetwork } from '../../../../network/ergo/ergo';

export const CardanoUpdate: FC = () => {
  const handleErgoButtonClick = () => changeSelectedNetwork(ergoNetwork as any);

  return (
    <Flex justify="center" align="center" stretch>
      <Flex.Item marginTop={8}>
        <Flex direction="col" align="center">
          <Flex.Item marginBottom={4}>
            <ToolOutlined
              style={{
                fontSize: '160px',
                color: 'var(--spectrum-primary-color)',
              }}
            />
          </Flex.Item>
          <Flex.Item marginBottom={2}>
            <Typography.Title level={2}>
              <Trans>{applicationConfig.cardanoUpdate?.title}</Trans>
            </Typography.Title>
          </Flex.Item>
          <Flex.Item marginBottom={8}>
            <Typography.Body align="center">
              <Trans>{applicationConfig.cardanoUpdate?.content}</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Button type="primary" size="large" onClick={handleErgoButtonClick}>
              <Trans>Go to Ergo Network</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};
