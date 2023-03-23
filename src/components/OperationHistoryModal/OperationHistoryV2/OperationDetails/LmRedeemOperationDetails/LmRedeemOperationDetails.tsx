import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { OperationStatus } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { LmRedeemItem } from '../../../../../network/ergo/api/operations/history/v2/types/LmRedeemOperation';
import { PairAssetBox } from '../../common/PairAssetBox/PairAssetBox';
import { OperationDetailsContainer } from '../common/OperationDetailsContainer/OperationDetailsContainer';
import { TransactionDetails } from '../common/TransactionDetails/TransactionDetails';
import { TransactionPending } from '../common/TransactionPending/TransactionPending';
import { TransactionRefund } from '../common/TransactionRefund/TransactionRefund';

export interface LmRedeemOperationDetailsProps {
  readonly lmRedeemItem: LmRedeemItem;
}

export const LmRedeemOperationDetails: FC<LmRedeemOperationDetailsProps> = ({
  lmRedeemItem,
}) => (
  <OperationDetailsContainer
    leftSide={
      <TransactionDetails
        title={t`Sent`}
        dateTime={lmRedeemItem.registerTx.dateTime}
        transactionId={lmRedeemItem.registerTx.id}
        content={
          <PairAssetBox pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)} />
        }
      />
    }
    rightSide={
      <>
        {lmRedeemItem.status === OperationStatus.Evaluated && (
          <TransactionDetails
            title={t`Received`}
            dateTime={lmRedeemItem.evaluateTx.dateTime}
            transactionId={lmRedeemItem.evaluateTx.id}
            content={
              <PairAssetBox pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)} />
            }
          />
        )}
        {lmRedeemItem.status === OperationStatus.Pending && (
          <TransactionPending title={t`Received`} />
        )}
        {lmRedeemItem.status === OperationStatus.Refunded && (
          <TransactionDetails
            title={t`Received`}
            dateTime={lmRedeemItem.refundTx.dateTime}
            transactionId={lmRedeemItem.refundTx.id}
            content={
              <PairAssetBox pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)} />
            }
          />
        )}
        {lmRedeemItem.status === OperationStatus.NeedRefund && (
          <TransactionRefund
            pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)}
            transactionId={lmRedeemItem.registerTx.id}
          />
        )}
      </>
    }
  />
);
