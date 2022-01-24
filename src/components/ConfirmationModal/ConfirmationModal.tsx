import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { TxId } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import React, { ReactNode } from 'react';

import { AssetLock } from '../../common/models/AssetLock';
import { Currency } from '../../common/models/Currency';
import { DialogRef, Flex, Modal, Typography } from '../../ergodex-cdk';
import { RequestProps } from '../../ergodex-cdk/components/Modal/presets/Request';
import { getLockingPeriodString } from '../../pages/Pool/utils';
import { LockedAsset } from '../../services/new/analytics';
import { exploreTx } from '../../utils/redirect';

export enum Operation {
  SWAP,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  REFUND,
  LOCK_LIQUIDITY,
  RELOCK_LIQUIDITY,
  WITHDRAWAL_LIQUIDITY,
}

export interface ModalChainingPayload {
  xAsset?: Currency;
  yAsset?: Currency;
  lpAsset?: Currency;
  time?: DateTime;
  assetLock?: AssetLock;
}

const getDescriptionByData = (
  operation: Operation,
  { xAsset, yAsset, lpAsset, time, assetLock }: ModalChainingPayload,
): ReactNode => {
  switch (operation) {
    case Operation.ADD_LIQUIDITY:
      return xAsset && yAsset
        ? `Adding liquidity ${xAsset.toString()} and ${yAsset.toString()}`
        : '';
    case Operation.REFUND:
      return xAsset && yAsset
        ? `Refunding ${xAsset.toString()} and ${yAsset.toString()}`
        : '';
    case Operation.REMOVE_LIQUIDITY:
      return xAsset && yAsset
        ? `Removing liquidity ${xAsset.toString()} and ${yAsset.toString()}`
        : '';
    case Operation.SWAP:
      return xAsset && yAsset
        ? `Swapping ${xAsset.toString()} for ${yAsset.toString()}`
        : '';
    case Operation.LOCK_LIQUIDITY:
      return xAsset && yAsset
        ? `Locking ${xAsset.toString()} and ${yAsset.toString()} (${
            lpAsset && lpAsset.toString({ suffix: false }) + ' LP-tokens'
          }) for ${time && getLockingPeriodString(time)}`
        : '';
    case Operation.RELOCK_LIQUIDITY:
      return `Relocking ${assetLock?.x.asset.name} and ${
        assetLock?.y.asset.name
      } (${
        lpAsset && lpAsset.toString({ suffix: false }) + ' LP-tokens'
      }) for ${time && getLockingPeriodString(time)}`;
  }
};

const ProgressModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
) => {
  return (
    <Flex col align="center">
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>Waiting for confirmation</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          {getDescriptionByData(operation, payload)}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body type="secondary" align="center">
          Confirm this transaction in your wallet
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

const ErrorModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        {getDescriptionByData(operation, payload)}
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center" type="secondary">
        Transaction rejected
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center" type="secondary">
        Try again later
      </Typography.Body>
    </Flex.Item>
  </Flex>
);

const SuccessModalContent = (txId: TxId) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Transaction submitted</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Link onClick={() => exploreTx(txId)}>
        View on Explorer
      </Typography.Link>
    </Flex.Item>
  </Flex>
);

export const openConfirmationModal = (
  actionContent: RequestProps['actionContent'],
  operation: Operation,
  payload: ModalChainingPayload,
): DialogRef => {
  return Modal.request({
    actionContent,
    errorContent: ErrorModalContent(operation, payload),
    progressContent: ProgressModalContent(operation, payload),
    successContent: (txId) => SuccessModalContent(txId),
  });
};
