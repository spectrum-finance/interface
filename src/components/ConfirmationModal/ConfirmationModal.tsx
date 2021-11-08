import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { ReactNode } from 'react';

import { Modal, Row, Typography } from '../../ergodex-cdk';
import { RequestProps } from '../../ergodex-cdk/components/Modal/presets/Request';
import { renderFractions } from '../../utils/math';

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
      return `Adding liquidity ${renderFractions(
        xAsset.amount,
        xAsset.asset.decimals,
      )} ${xAsset.asset.name} and ${renderFractions(
        yAsset.amount,
        yAsset.asset.decimals,
      )} ${yAsset.asset.name}`;
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
      return `Swapping ${renderFractions(
        xAsset.amount,
        xAsset.asset.decimals,
      )} ${xAsset.asset.name} for ${renderFractions(
        yAsset.amount,
        yAsset.asset.decimals,
      )} ${yAsset.asset.name}`;
  }
};

const ProgressModalContent = (
  operation: Operation,
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
) => {
  return (
    <>
      <Row justify="center" bottomGutter={1}>
        <Typography.Title level={4}>Waiting for confirmation</Typography.Title>
      </Row>
      <Row justify="center" bottomGutter={1}>
        <Typography.Text>
          {getDescriptionByData(operation, xAsset, yAsset)}
        </Typography.Text>
      </Row>
      <Row justify="center" bottomGutter={1}>
        <Typography.Text type="secondary">
          Confirm this transaction in your wallet
        </Typography.Text>
      </Row>
    </>
  );
};

const ErrorModalContent = (
  operation: Operation,
  xAsset: ConfirmationAssetAmount,
  yAsset: ConfirmationAssetAmount,
) => (
  <>
    <Row justify="center" gutter={0.5}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text>
        {getDescriptionByData(operation, xAsset, yAsset)}
      </Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Trunsuction rejected</Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Try again later</Typography.Text>
    </Row>
  </>
);
const SuccessModalContent = () => (
  <>
    <Row justify="center" gutter={0.5}>
      <Typography.Title level={4}>Transaction submitted</Typography.Title>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Link>View on Explorer</Typography.Link>
    </Row>
  </>
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
    successContent: ProgressModalContent(operation, xAsset, yAsset),
  });
};
