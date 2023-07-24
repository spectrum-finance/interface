import {
  Button,
  CloseCircleOutlined,
  DataStateView,
  Flex,
  ReloadOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

export interface ErrorStateProps {
  readonly onReloadClick: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({ onReloadClick }) => (
  <DataStateView
    height={420}
    iconGutter={4}
    icon={
      <CloseCircleOutlined
        style={{ fontSize: 35, color: 'var(--spectrum-primary-color)' }}
      />
    }
  >
    <Flex col align="center">
      <Flex.Item>
        <Typography.Title level={3}>
          <Trans>Failed to load orders</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Trans>Try again or</Trans>{' '}
        <Button type="link" style={{ padding: 0 }}>
          <Trans>contact support</Trans>
        </Button>
      </Flex.Item>
      <Button
        onClick={onReloadClick}
        type="primary"
        size="middle"
        icon={<ReloadOutlined />}
      >
        {t`Retry`}
      </Button>
    </Flex>
  </DataStateView>
);
