import { Button, notification } from '@ergolabs/ui-kit';

import { notificationKeys } from '../notificationKeys';

export const sendCollateralGuideNotification = () => {
  notification.open({
    key: notificationKeys.COLLATERAL_GUIDE,
    description: `To perform refund operation you need to provide collateral in your wallet. Go to wallet's settings and search for "Collateral" feature.`,
    message: 'Provide collateral',
    duration: 0,
    type: 'info',
    btn: (
      <Button
        href="https://docs.cardano.org/plutus/collateral-mechanism/"
        target="_blank"
      >
        Read more
      </Button>
    ),
  });
};
