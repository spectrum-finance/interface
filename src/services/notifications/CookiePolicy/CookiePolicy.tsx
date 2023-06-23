import './CookiePolicy.less';

import {
  Button,
  Flex,
  notification,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import * as React from 'react';

import { localStorageManager } from '../../../common/utils/localStorageManager';
import { notificationKeys } from '../notificationKeys';

const CookiePolicy: React.FC<{ notification: typeof notification }> = ({
  notification,
}) => {
  const { s } = useDevice();

  const reject = () => {
    localStorageManager.set(notificationKeys.COOKIE_POLICY, 'reject');
    fireAnalyticsEvent('Cookies Rejected');
    notification.close(notificationKeys.COOKIE_POLICY);
  };

  const accept = () => {
    localStorageManager.set(notificationKeys.COOKIE_POLICY, 'accept');
    fireAnalyticsEvent('Cookies Accepted');
    notification.close(notificationKeys.COOKIE_POLICY);
  };

  if (s) {
    return (
      <>
        <Typography.Body>
          {t`By clicking “Accept All Cookies”, you  agree to the storing of cookies
          on your device to enhance site navigation, analyse app usage, and
          assist in our marketing efforts.`}
        </Typography.Body>
        <Flex>
          <Flex.Item marginRight={4} flex={1} marginTop={4}>
            <Button size="large" onClick={reject} block>{t`Reject`}</Button>
          </Flex.Item>
          <Flex.Item flex={1} marginTop={4}>
            <Button
              block
              size="large"
              type="primary"
              onClick={accept}
            >{t`Accept all cookies`}</Button>
          </Flex.Item>
        </Flex>
      </>
    );
  }

  return (
    <Flex align="center">
      <Flex.Item flex={1} marginRight={4}>
        <Typography.Title level={5}>
          {t`By clicking “Accept All Cookies”, you  agree to the storing of cookies
          on your device to enhance site navigation, analyse app usage, and
          assist in our marketing efforts.`}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginRight={4}>
        <Button size="large" onClick={reject}>{t`Reject`}</Button>
      </Flex.Item>
      <Flex.Item>
        <Button
          size="large"
          type="primary"
          onClick={accept}
        >{t`Accept all cookies`}</Button>
      </Flex.Item>
    </Flex>
  );
};

export const openCookiePolicy = (): void => {
  if (localStorageManager.get(notificationKeys.COOKIE_POLICY)) {
    return;
  }

  notification.open({
    key: notificationKeys.COOKIE_POLICY,
    message: <CookiePolicy notification={notification} />,
    className: 'cookie-policy',
    duration: 0,
    btn: <></>,
    closeIcon: <></>,
  });
};
