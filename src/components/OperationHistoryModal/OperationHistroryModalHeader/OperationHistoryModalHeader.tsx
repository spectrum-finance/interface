import { Alert, Flex, Switch, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { setSettings, useSettings } from '../../../gateway/settings/settings';
import { IsErgo } from '../../IsErgo/IsErgo';

const BetaAlert = styled(Alert)`
  background: #262150;
`;

export const OperationHistoryModalHeader: FC = () => {
  const settings = useSettings();

  return (
    <Flex align="center" justify="space-between" width="100%">
      <Trans>Orders history</Trans>
      <IsErgo>
        <Flex.Item marginRight={8} display="flex" gap={1}>
          <Flex.Item marginRight={1}>
            <Switch
              checked={settings.newHistory}
              onChange={() =>
                setSettings({ ...settings, newHistory: !settings.newHistory })
              }
            />
          </Flex.Item>
          <Flex.Item marginRight={1}>
            <Typography.Body size="large">
              <Trans>New version</Trans>
            </Typography.Body>
          </Flex.Item>
          {/*<BetaAlert message="test" />*/}
        </Flex.Item>
      </IsErgo>
    </Flex>
  );
};
