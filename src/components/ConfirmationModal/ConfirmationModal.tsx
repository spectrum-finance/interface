import { TxId } from '@ergolabs/ergo-sdk';
import React, { ReactNode } from 'react';

import { Currency } from '../../common/models/Currency';
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

const getDescriptionByData = (
  operation: Operation,
  xAsset: Currency,
  yAsset: Currency,
): ReactNode => {
  switch (operation) {
    case Operation.ADD_LIQUIDITY:
      return `Adding liquidity ${xAsset.toString()} and ${yAsset.toString()}`;
    case Operation.REFUND:
      return `Refunding ${xAsset.toString()} and ${yAsset.toString()}`;
    case Operation.REMOVE_LIQUIDITY:
      return `Removing liquidity ${xAsset.toString()} and ${yAsset.toString()}`;
    case Operation.SWAP:
      return `Swapping ${xAsset.toString()} for ${yAsset.toString()}`;
  }
};

const ProgressModalContent = (
  operation: Operation,
  xAsset: Currency,
  yAsset: Currency,
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
  xAsset: Currency,
  yAsset: Currency,
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
  xAsset: Currency,
  yAsset: Currency,
) => {
  return Modal.request({
    actionContent,
    errorContent: ErrorModalContent(operation, xAsset, yAsset),
    progressContent: ProgressModalContent(operation, xAsset, yAsset),
    successContent: (txId) => SuccessModalContent(txId),
  });
};
