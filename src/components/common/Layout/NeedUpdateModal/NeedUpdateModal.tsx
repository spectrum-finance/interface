import {
  Button,
  Flex,
  Modal,
  Typography,
  WarningOutlined,
} from '@ergolabs/ui-kit';
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
            A new version of the app is available. Refresh the page to see the
            latest updates.
          </Typography.Title>
        </Flex.Item>
        <Button
          size="large"
          onClick={() => location.reload()}
          type="primary"
          width="100%"
        >
          Refresh
        </Button>
      </Flex>
    </Modal.Content>
  );
};
