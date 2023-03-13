import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { OperationStatus } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { LockItem } from '../../../../../network/ergo/api/operations/history/v2/types/LockOperation';
import { PairAssetBox } from '../../common/PairAssetBox/PairAssetBox';
import { OperationDetailsContainer } from '../common/OperationDetailsContainer/OperationDetailsContainer';
import { TransactionDetails } from '../common/TransactionDetails/TransactionDetails';
import { TransactionPending } from '../common/TransactionPending/TransactionPending';

export interface LockOperationDetailsProps {
  readonly lockItem: LockItem;
}

export const LockOperationDetails: FC<LockOperationDetailsProps> = ({
  lockItem,
}) => (
  <OperationDetailsContainer
    leftSide={
      <TransactionDetails
        title={t`Sent`}
        dateTime={lockItem.registerTx.dateTime}
        transactionId={lockItem.registerTx.id}
        content={<PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />}
      />
    }
    rightSide={
      <>
        {lockItem.status === OperationStatus.Evaluated && (
          <TransactionDetails
            title={t`Received`}
            dateTime={lockItem.registerTx.dateTime}
            transactionId={lockItem.registerTx.id}
            content={<PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />}
          />
        )}
        {lockItem.status === OperationStatus.Pending && (
          <TransactionPending title={t`Received`} />
        )}
      </>
    }
  />
);
