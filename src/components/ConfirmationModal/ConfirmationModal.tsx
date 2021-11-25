import { TxId } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { ReactNode } from 'react';

import { Flex, Modal, Typography } from '../../ergodex-cdk';
import { RequestProps } from '../../ergodex-cdk/components/Modal/presets/Request';
import { renderFractions } from '../../utils/math';
import { exploreTx } from '../../utils/redirect';

export enum Operation {
  SWAP,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  REFUND,
}

export interface ConfirmationAssetAmount {
  readonly amount: number;
  readonly asset: AssetInfo;
}

const getDescriptionByData = (
  operation: Operation,
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
): ReactNode => {
  switch (operation) {
    case Operation.ADD_LIQUIDITY:
      return `Adding liquidity ${xAsset.amount} ${xAsset.asset.name} and ${yAsset.amount} ${yAsset.asset.name}`;
    case Operation.REFUND:
      return `Refunding ${renderFractions(
        xAsset.amount,
        xAsset.asset.decimals,
      )} ${xAsset.asset.name} and ${renderFractions(
        yAsset.amount,
        yAsset.asset.decimals,
      )} ${yAsset.asset.name}`;
    case Operation.REMOVE_LIQUIDITY:
      return `Removing liquidity ${renderFractions(
        xAsset.amount,
        xAsset.asset.decimals,
      )} ${xAsset.asset.name} and ${renderFractions(
        yAsset.amount,
        yAsset.asset.decimals,
      )} ${yAsset.asset.name}`;
    case Operation.SWAP:
      return `Swapping ${xAsset.amount} ${xAsset.asset.name} for ${yAsset.amount} ${yAsset.asset.name}`;
  }
};

const ProgressModalContent = (
  operation: Operation,
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
) => {
  return (
    <Flex col align="center">
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>Waiting for confirmation</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          {getDescriptionByData(operation, xAsset, yAsset)}
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
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        {getDescriptionByData(operation, xAsset, yAsset)}
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
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
) => {
  return Modal.request({
    actionContent,
    errorContent: ErrorModalContent(operation, xAsset, yAsset),
    progressContent: ProgressModalContent(operation, xAsset, yAsset),
    successContent: (txId) => SuccessModalContent(txId),
  });
};
