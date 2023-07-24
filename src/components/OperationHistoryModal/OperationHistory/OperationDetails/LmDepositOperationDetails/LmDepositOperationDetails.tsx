import { t } from '@lingui/macro';
import { FC } from 'react';

import {
  LmDepositItem,
  OperationStatus,
} from '../../../../../common/models/OperationV2';
import { PairAssetBox } from '../../common/PairAssetBox/PairAssetBox';
import { OperationDetailsContainer } from '../common/OperationDetailsContainer/OperationDetailsContainer';
import { TransactionDetails } from '../common/TransactionDetails/TransactionDetails';
import { TransactionPending } from '../common/TransactionPending/TransactionPending';
import { TransactionRefund } from '../common/TransactionRefund/TransactionRefund';

export interface LmDepositOperationDetailsProps {
  readonly lmDepositItem: LmDepositItem;
}

export const LmDepositOperationDetails: FC<LmDepositOperationDetailsProps> = ({
  lmDepositItem,
}) => (
  <OperationDetailsContainer
    leftSide={
      <TransactionDetails
        title={t`Placed Order`}
        dateTime={lmDepositItem.registerTx.dateTime}
        transactionId={lmDepositItem.registerTx.id}
        content={
          <PairAssetBox pair={lmDepositItem.pool.shares(lmDepositItem.input)} />
        }
      />
    }
    rightSide={
      <>
        {lmDepositItem.status === OperationStatus.Evaluated && (
          <TransactionDetails
            title={t`Executed Order`}
            dateTime={lmDepositItem.evaluateTx.dateTime}
            transactionId={lmDepositItem.evaluateTx.id}
            content={
              <PairAssetBox
                pair={lmDepositItem.pool.shares(lmDepositItem.input)}
              />
            }
          />
        )}
        {lmDepositItem.status === OperationStatus.Pending && (
          <TransactionPending title={t`EExecuted Order`} />
        )}
        {lmDepositItem.status === OperationStatus.Refunded && (
          <TransactionDetails
            title={t`Executed Order`}
            dateTime={lmDepositItem.refundTx.dateTime}
            transactionId={lmDepositItem.refundTx.id}
            content={
              <PairAssetBox
                pair={lmDepositItem.pool.shares(lmDepositItem.input)}
              />
            }
          />
        )}
        {lmDepositItem.status === OperationStatus.NeedRefund && (
          <TransactionRefund
            pair={lmDepositItem.pool.shares(lmDepositItem.input)}
            transactionId={lmDepositItem.registerTx.id}
          />
        )}
      </>
    }
  />
);
