import {
  Button,
  Flex,
  Modal,
  Typography,
  WarningOutlined,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const NeedUpdateModal: FC = () => {
  return (
    <Modal.Content width={343}>
      <Flex col align="center">
        <Flex.Item marginBottom={4}>
          <WarningOutlined
            style={{ fontSize: 120, color: 'var(--spectrum-primary-color)' }}
          />
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Typography.Title level={4} style={{ textAlign: 'center' }}>
            <Trans>
              A new version of the app is available. Refresh the page to see the
              latest updates.
            </Trans>
          </Typography.Title>
        </Flex.Item>
        <Button
          size="large"
          onClick={() => location.reload()}
          type="primary"
          width="100%"
        >
          <Trans>Refresh</Trans>
        </Button>
      </Flex>
    </Modal.Content>
  );
};
