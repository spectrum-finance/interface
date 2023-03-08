import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { AddLiquidityItem } from '../../../../../network/ergo/api/operations/history/v2/types/AddLiquidityOperation';
import { OperationStatus } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { PairAssetBox } from '../../common/PairAssetBox/PairAssetBox';
import { SingleAssetBox } from '../../common/SingleAssetBox/SingleAssetBox';
import { OperationDetailsContainer } from '../common/OperationDetailsContainer/OperationDetailsContainer';
import { TransactionDetails } from '../common/TransactionDetails/TransactionDetails';
import { TransactionPending } from '../common/TransactionPending/TransactionPending';
import { TransactionRefund } from '../common/TransactionRefund/TransactionRefund';

export interface AddLiquidityOperationDetailsProps {
  readonly addLiquidityItem: AddLiquidityItem;
}

export const AddLiquidityOperationDetails: FC<AddLiquidityOperationDetailsProps> =
  ({ addLiquidityItem }) => (
    <OperationDetailsContainer
      leftSide={
        <TransactionDetails
          title={t`Sent`}
          dateTime={addLiquidityItem.registerTx.dateTime}
          transactionId={addLiquidityItem.registerTx.id}
          content={
            <Flex col width={200}>
              <Flex.Item marginBottom={0.5}>
                <SingleAssetBox currency={addLiquidityItem.x} />
              </Flex.Item>
              <Flex.Item>
                <SingleAssetBox currency={addLiquidityItem.y} />
              </Flex.Item>
            </Flex>
          }
        />
      }
      rightSide={
        <>
          {addLiquidityItem.status === OperationStatus.Evaluated && (
            <TransactionDetails
              title={t`Received`}
              dateTime={addLiquidityItem.evaluateTx.dateTime}
              transactionId={addLiquidityItem.evaluateTx.id}
              content={
                <PairAssetBox
                  pair={addLiquidityItem.pool.shares(addLiquidityItem.lp)}
                />
              }
            />
          )}
          {addLiquidityItem.status === OperationStatus.Pending && (
            <TransactionPending title={t`Received`} />
          )}
          {addLiquidityItem.status === OperationStatus.Refunded && (
            <TransactionDetails
              title={t`Received`}
              dateTime={addLiquidityItem.refundTx.dateTime}
              transactionId={addLiquidityItem.refundTx.id}
              content={
                <Flex col width={200}>
                  <Flex.Item marginBottom={0.5}>
                    <SingleAssetBox currency={addLiquidityItem.x} />
                  </Flex.Item>
                  <Flex.Item>
                    <SingleAssetBox currency={addLiquidityItem.y} />
                  </Flex.Item>
                </Flex>
              }
            />
          )}
          {addLiquidityItem.status === OperationStatus.NeedRefund && (
            <TransactionRefund transactionId={addLiquidityItem.registerTx.id} />
          )}
        </>
      }
    />
  );
