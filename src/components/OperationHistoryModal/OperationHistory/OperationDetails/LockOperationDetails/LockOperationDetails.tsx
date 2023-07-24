import { t } from '@lingui/macro';
import { FC } from 'react';

import {
  LockItem,
  OperationStatus,
} from '../../../../../common/models/OperationV2';
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
        title={t`Placed Order`}
        dateTime={lockItem.registerTx.dateTime}
        transactionId={lockItem.registerTx.id}
        content={<PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />}
      />
    }
    rightSide={
      <>
        {lockItem.status === OperationStatus.Evaluated && (
          <TransactionDetails
            title={t`Executed Order`}
            dateTime={lockItem.registerTx.dateTime}
            transactionId={lockItem.registerTx.id}
            content={<PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />}
          />
        )}
        {lockItem.status === OperationStatus.Pending && (
          <TransactionPending title={t`Executed Order`} />
        )}
      </>
    }
  />
);
