import './CookiePolicy.less';

import { Button, Flex, notification, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React from 'react';

import { localStorageManager } from '../../../common/utils/localStorageManager';

const COOKIE_POLICY_NOTIFICATION_KEY = 'cookie-policy';

export const openCookiePolicy = (): void => {
  if (localStorageManager.get(COOKIE_POLICY_NOTIFICATION_KEY)) {
    return;
  }

  const reject = () => {
    localStorageManager.set(COOKIE_POLICY_NOTIFICATION_KEY, 'reject');
    notification.close(COOKIE_POLICY_NOTIFICATION_KEY);
  };

  const accept = () => {
    localStorageManager.set(COOKIE_POLICY_NOTIFICATION_KEY, 'accept');
    notification.close(COOKIE_POLICY_NOTIFICATION_KEY);
  };

  const message = (
    <Flex align="center">
      <Flex.Item flex={1} marginRight={4}>
        <Typography.Title level={5}>
          {t`By clicking “Accept All Cookies”, you  agree to the storing of cookies
          on your device to enhance site navigation, analyse site usage, and
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

  notification.open({
    key: COOKIE_POLICY_NOTIFICATION_KEY,
    message,
    className: 'cookie-policy',
    duration: 0,
    btn: <></>,
    closeIcon: <></>,
  });
};
