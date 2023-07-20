import { HistoryOutlined, notification } from '@ergolabs/ui-kit';

import { notificationKeys } from '../notificationKeys';

export const showRefundOperationNotification = () => {
  notification.open({
    key: notificationKeys.REFUND,
    description: (
      <>
        Some of your funds are locked in smart contracts. Don&apos;t worry! To
        access them, please click on the Order History button (
        <HistoryOutlined />) to initiate a refund.
      </>
    ),
    message: 'Refund order',
    duration: 0,
    type: 'warning',
  });
};

export const closeRefundOperationNotification = () => {
  notification.close(notificationKeys.REFUND);
};
