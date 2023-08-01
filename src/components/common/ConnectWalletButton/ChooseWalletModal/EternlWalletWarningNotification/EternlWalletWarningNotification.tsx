import {
  Flex,
  InfoCircleOutlined,
  notification,
  Typography,
} from '@ergolabs/ui-kit';
import { FC } from 'react';

const ETERNL_WALLET_WARNING_NOTIFICATION_KEY =
  'ETERNL_WALLET_WARNING_NOTIFICATION_KEY';

const EternlWalletWarningNotification: FC = () => (
  <Flex style={{ marginBottom: -8 }}>
    <Flex.Item marginRight={4}>
      <InfoCircleOutlined
        size={20}
        style={{ fontSize: 20, color: 'var(--spectrum-warning-color)' }}
      />
    </Flex.Item>
    <Flex.Item>
      <Typography.Title level={5}>Eternl Wallet Issues</Typography.Title>
      <Typography.Body>
        Several issues have been identified in the interaction between the
        Eternl wallet and the Spectrum Finance interface. We are currently
        collaborating with the Eternl team to rectify these problems. In the
        meantime, we recommend using alternative wallets for activities within
        the Spectrum Finance interface. Please follow our official social media
        platforms to keep abreast of updates.
      </Typography.Body>
    </Flex.Item>
  </Flex>
);

export const openEternlWalletWarningNotification = (): void => {
  notification.open({
    key: ETERNL_WALLET_WARNING_NOTIFICATION_KEY,
    message: <EternlWalletWarningNotification />,
    placement: 'topRightBackward' as any,
    duration: 0,
    btn: undefined,
  });
};
