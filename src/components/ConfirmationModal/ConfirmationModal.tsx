import { TxId } from '@ergolabs/ergo-sdk';
import {
  Button,
  CloseCircleOutlined,
  Flex,
  Modal,
  ModalRef,
  Typography,
  WalletOutlined,
  WarningOutlined,
} from '@ergolabs/ui-kit';
import { RequestProps } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import { TimeoutError } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as DiscordIcon } from '../../assets/icons/social/Discord.svg';
import { ReactComponent as TelegramIcon } from '../../assets/icons/social/Telegram.svg';
import { AssetLock } from '../../common/models/AssetLock';
import { Currency } from '../../common/models/Currency';
import { downloadErrorLog } from '../../common/services/ErrorLogs';
import { exploreTx } from '../../gateway/utils/exploreAddress';
import { getLockingPeriodString } from '../../pages/Liquidity/utils';

export enum Operation {
  SWAP,
  UNSTAKE,
  STAKE,
  ERGOPAY,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  REFUND,
  LOCK_LIQUIDITY,
  RELOCK_LIQUIDITY,
  WITHDRAWAL_LIQUIDITY,
  REQUEST_TESTNET_ASSET,
  CREATE_FARM,
  STAKE_LIQUIDITY_FARM,
  WITHDRAWAL_LIQUIDITY_FARM,
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
        ? t`Adding liquidity ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()}`
        : '';
    case Operation.REFUND:
      return xAsset && yAsset
        ? t`Cancelling ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()}`
        : '';
    case Operation.REMOVE_LIQUIDITY:
      return xAsset && yAsset
        ? t`Removing liquidity ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()}`
        : '';
    case Operation.STAKE:
      return xAsset && yAsset
        ? t`Staking ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()} in the farm`
        : '';
    case Operation.UNSTAKE:
      return xAsset && yAsset
        ? t`Unstaking ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()} from the farm`
        : '';
    case Operation.SWAP:
    case Operation.ERGOPAY:
      return xAsset && yAsset
        ? t`Swapping ${xAsset.toCurrencyString()} for ${yAsset.toCurrencyString()}`
        : '';
    case Operation.LOCK_LIQUIDITY:
      return xAsset && yAsset
        ? t`Locking ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()} (${
            lpAsset && lpAsset.toString() + ' LP-assets'
          }) for ${time && getLockingPeriodString(time)}`
        : '';
    case Operation.RELOCK_LIQUIDITY:
      return t`Relocking ${assetLock?.x.toCurrencyString()} and ${assetLock?.y.toCurrencyString()} (${
        assetLock && assetLock.lp.toString() + ' LP-assets'
      })`;
    case Operation.CREATE_FARM:
      return t`Creating Farm`;
    case Operation.STAKE_LIQUIDITY_FARM:
      return xAsset && yAsset
        ? t`Stake ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()} liquidity`
        : '';
    case Operation.WITHDRAWAL_LIQUIDITY_FARM:
      return xAsset && yAsset
        ? t`Withdraw ${xAsset.toCurrencyString()} and ${yAsset.toCurrencyString()}  liquidity`
        : '';
  }
};

const ProgressModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
) => {
  return (
    <Flex col align="center">
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>
          <Trans>Waiting for confirmation</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          {getDescriptionByData(operation, payload)}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body secondary align="center">
          <Trans>Confirm this transaction in your wallet</Trans>
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

const ErrorModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
  withErrorIcon?: boolean,
) => {
  return (
    <Flex col align="center">
      {withErrorIcon && (
        <Flex.Item marginBottom={6}>
          <CloseCircleOutlined
            style={{ fontSize: 80, color: 'var(--spectrum-primary-color)' }}
          />
        </Flex.Item>
      )}
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>
          <Trans>Error</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          {getDescriptionByData(operation, payload)}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center" secondary>
          <Trans>Transaction rejected</Trans>
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body align="center" secondary>
          <Trans>Try again later</Trans>
        </Typography.Body>
      </Flex.Item>
      <Button size="large" type="dashed" onClick={downloadErrorLog}>
        <Trans>Download Error log</Trans>
      </Button>
    </Flex>
  );
};

const isNoCollateralErrorMessage = (msg: string) => {
  return msg.endsWith('no collateral inputs are added');
};
const NoCollateralErrorModalContent = () => {
  return (
    <Flex align="center" col>
      <Flex.Item marginBottom={6}>
        <WalletOutlined
          style={{ fontSize: 80, color: 'var(--spectrum-primary-color)' }}
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>
          <Trans>Collateral is not provided!</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          <Trans>
            Visit your wallet app and provide collateral to proceed with order
            canceling.
          </Trans>
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

const isNoAdaForFeeErrorMessage = (msg: string) => {
  return msg.endsWith('insufficient balance for refund');
};
const NoAdaForFeeErrorModalContent = () => {
  return (
    <Flex align="center" col>
      <Flex.Item marginBottom={6}>
        <WarningOutlined
          style={{ fontSize: 80, color: 'var(--spectrum-primary-color)' }}
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>
          <Trans>Not enough ADA for fees</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          <Trans>Refill the ADA balance to continue canceling the order.</Trans>
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

const RefundErrorModalContent = (
  error: Error | string,
  payload: ModalChainingPayload,
) => {
  const message = error instanceof Error ? error.message : error;

  if (isNoCollateralErrorMessage(message)) {
    return NoCollateralErrorModalContent();
  }
  if (isNoAdaForFeeErrorMessage(message)) {
    return NoAdaForFeeErrorModalContent();
  }

  return ErrorModalContent(Operation.REFUND, payload, true);
};

const SuccessModalContent = (txId: TxId) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>
        <Trans>Transaction submitted</Trans>
      </Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Link onClick={() => exploreTx(txId)}>
        <Trans>View on Explorer</Trans>
      </Typography.Link>
    </Flex.Item>
  </Flex>
);

const SuccessErgopayContent = () => (
  <Flex col align="center">
    Test
    {/*<Flex.Item marginBottom={1}>*/}
    {/*  <Typography.Title level={4}>*/}
    {/*    <Trans>Transaction submitted</Trans>*/}
    {/*  </Typography.Title>*/}
    {/*</Flex.Item>*/}
    {/*<Flex.Item marginBottom={1}>*/}
    {/*  <Typography.Link onClick={() => exploreTx(txId)}>*/}
    {/*    <Trans>View on Explorer Ergopay</Trans>*/}
    {/*  </Typography.Link>*/}
    {/*</Flex.Item>*/}
  </Flex>
);

const YoroiIssueModalContent = () => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>
        <Trans>Error</Trans>
      </Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        <Trans>Timeout error</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        <Trans>Try again later</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        <Trans>Get help in our channels:</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1} justify="center">
      <Flex>
        <Flex.Item marginRight={1}>
          <a
            style={{ color: 'var(--spectrum-primary-color)' }}
            href={applicationConfig.support.discord}
            target="_blank"
            rel="noreferrer"
          >
            <DiscordIcon style={{ cursor: 'pointer' }} />
          </a>
        </Flex.Item>
        <Flex.Item>
          <a
            style={{ color: 'var(--spectrum-primary-color)' }}
            href={applicationConfig.support.telegram}
            target="_blank"
            rel="noreferrer"
          >
            <TelegramIcon style={{ cursor: 'pointer' }} />
          </a>
        </Flex.Item>
      </Flex>
    </Flex.Item>
  </Flex>
);

export const openConfirmationModal = (
  actionContent: RequestProps['actionContent'],
  operation: Operation,
  payload: ModalChainingPayload,
  onCancel?: () => void,
  noErrorIcon?: boolean,
): ModalRef => {
  return Modal.request({
    actionContent,
    errorContent: (error: Error) => {
      if (error instanceof TimeoutError) {
        return YoroiIssueModalContent();
      }
      if (operation === Operation.REFUND) {
        return RefundErrorModalContent(error, payload);
      }
      return ErrorModalContent(operation, payload);
    },
    noErrorIcon,
    progressContent:
      operation === Operation.UNSTAKE || operation === Operation.STAKE
        ? ProgressModalContent.bind(null, operation)
        : ProgressModalContent(operation, payload),
    successContent: (txId) => {
      return operation === Operation.ERGOPAY
        ? SuccessErgopayContent()
        : SuccessModalContent(txId);
    },
    success:
      operation === Operation.ERGOPAY
        ? () => SuccessErgopayContent()
        : undefined,
    onCancel,
  });
};
