import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { first } from 'rxjs';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { TxId } from '../../../../../../common/types';
import { addresses$ } from '../../../../../../gateway/api/addresses';
import { refund } from '../../../../../../gateway/api/operations/refund';

export interface TransactionRefundProps {
  readonly transactionId: TxId;
}

export const TransactionRefund: FC<TransactionRefundProps> = ({
  transactionId,
}) => {
  const [addresses] = useObservable(addresses$);

  const handleRefundButtonClick = () => {
    // const payload =
    //   operation.type === 'swap'
    //     ? { xAsset: operation.base, yAsset: operation.quote }
    //     : { xAsset: operation.x, yAsset: operation.y };
    //
    // refund(addresses, operation, payload.xAsset, payload.yAsset)
    //   .pipe(first())
    //   .subscribe();
  };

  return (
    <Flex col align="center">
      <Flex.Item marginBottom={2}>
        <Typography.Body size="small" secondary align="center">
          <Trans>
            The price has changed while your order was being processed. So we
            didn’t execute it to prevent losses. Click the button to get your
            funds back.
          </Trans>
        </Typography.Body>
      </Flex.Item>
      <Button
        width={197}
        type="primary"
        htmlType="button"
        size="middle"
        onClick={handleRefundButtonClick}
      >
        <Trans>Refund</Trans>
      </Button>
    </Flex>
  );
};
