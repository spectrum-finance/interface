import {
  Box,
  Button,
  CheckFn,
  Flex,
  Form,
  Messages,
  Popover,
  SettingOutlined,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import { filter, skip } from 'rxjs';

import { MIN_NITRO } from '../../common/constants/erg';
import { defaultSlippage, MIN_SLIPPAGE } from '../../common/constants/settings';
import { useSubscription } from '../../common/hooks/useObservable';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { IsErgo } from '../IsErgo/IsErgo';
import { FeeCurrencySelector } from './FeeCurrencySelector/FeeCurrencySelector';
import { NitroInput } from './NitroInput/NitroInput';
import { SlippageInput } from './SlippageInput/SlippageInput';

interface SettingsModel {
  readonly slippage: number;
  readonly nitro: number;
  readonly executionFeeAsset: AssetInfo;
}

const slippageCheck: CheckFn<number> = (value) =>
  value > 10 ? 'transactionFrontrun' : undefined;

const slippageTxFailCheck: CheckFn<number> = (value) =>
  value < defaultSlippage ? 'transactionMayFail' : undefined;

const minSlippageCheck: CheckFn<number> = (value) =>
  isNaN(value) || value < MIN_SLIPPAGE ? 'minSlippage' : undefined;

const nitroCheck: CheckFn<number> = (value) =>
  isNaN(value) || value < MIN_NITRO ? 'minNitro' : undefined;

export interface OperationSettingsProps {
  readonly minExFee: Currency;
  readonly maxExFee: Currency;
  readonly setSlippage: (slippage: number) => void;
  readonly setNitro: (nitro: number) => void;
  readonly setExecutionFeeAsset: (executionFee: AssetInfo) => void;
  readonly executionFeeAsset: AssetInfo;
  readonly nitro: number;
  readonly slippage: number;
  readonly hideNitro?: boolean;
  readonly hideSlippage?: boolean;
  readonly feeAssets?: AssetInfo[];
}

export const OperationSettings: FC<OperationSettingsProps> = ({
  minExFee,
  maxExFee,
  setSlippage,
  setNitro,
  setExecutionFeeAsset,
  executionFeeAsset,
  nitro,
  slippage,
  hideNitro,
  hideSlippage,
  feeAssets,
}) => {
  const warningMessages: Messages<SettingsModel> = {
    slippage: {
      transactionFrontrun: t`Your transaction may be frontrun`,
      transactionMayFail: t`Your transaction may fail`,
    },
  };

  const errorMessages: Messages<SettingsModel> = {
    nitro: {
      minNitro: t`Minimal Nitro value is` + ` ${MIN_NITRO}`,
    },
    slippage: {
      minSlippage: t`Minimal Slippage is` + ` ${MIN_SLIPPAGE}`,
    },
  };

  const [isPopoverShown, setIsPopoverShown] = useState(false);

  const form = useForm<SettingsModel>({
    slippage: useForm.ctrl(
      slippage,
      [minSlippageCheck],
      [slippageCheck, slippageTxFailCheck],
    ),
    nitro: useForm.ctrl(nitro, [nitroCheck]),
    executionFeeAsset: executionFeeAsset,
  });

  const handlePopoverShown = (visible: boolean) => {
    if (!visible) {
      form.reset(
        {
          slippage: slippage,
          nitro: nitro,
        },
        { emitEvent: 'system' },
      );
    }
    setIsPopoverShown((prev) => !prev);
  };

  useSubscription(
    form.controls.slippage.valueChanges$.pipe(
      skip(1),
      filter((value) => !!value && value >= MIN_SLIPPAGE),
    ),
    (slippage) => setSlippage(slippage),
    [slippage, nitro],
  );

  useSubscription(
    form.controls.nitro.valueChanges$.pipe(
      skip(1),
      filter((value) => !!value && value >= MIN_NITRO),
    ),
    (nitro) => setNitro(nitro),
    [slippage, nitro],
  );

  useSubscription(
    form.controls.executionFeeAsset.valueChanges$.pipe(skip(1)),
    (executionFeeAsset) => {
      if (executionFeeAsset) {
        setExecutionFeeAsset(executionFeeAsset);
      }
    },
    [executionFeeAsset],
  );

  const Setting: JSX.Element = (
    <Box bordered={false} borderRadius="m" padding={4} width={360}>
      <Form
        form={form}
        onSubmit={() => {}}
        warningMessages={warningMessages}
        errorMessages={errorMessages}
      >
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Typography.Title level={4}>
              <Trans>Transaction Settings</Trans>
            </Typography.Title>
          </Flex.Item>

          {hideSlippage ? null : (
            <>
              <Flex.Item marginBottom={1}>
                <InfoTooltip
                  width={200}
                  content={t`Your transaction will revert if the price changes unfavorably by more than this percentage`}
                >
                  <Typography.Body strong>
                    <Trans>Slippage tolerance</Trans>
                  </Typography.Body>
                </InfoTooltip>
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <Form.Item name="slippage">
                  {({ onChange, value, state, message }) => (
                    <SlippageInput
                      state={state}
                      message={message}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                </Form.Item>
              </Flex.Item>
            </>
          )}
          {feeAssets?.length && (
            <IsErgo>
              <Flex.Item marginBottom={1}>
                <InfoTooltip
                  width={200}
                  content={t`The Honey 🍯 is paid to off-chain validators who execute DEX orders`}
                >
                  <Typography.Body strong>
                    <Trans>Honey 🍯</Trans>
                  </Typography.Body>
                </InfoTooltip>
              </Flex.Item>
              <Flex.Item marginBottom={hideNitro ? 0 : 2}>
                <Form.Item name="executionFeeAsset">
                  {({ onChange, value }) => (
                    <FeeCurrencySelector
                      assets={feeAssets}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Form.Item>
              </Flex.Item>
            </IsErgo>
          )}
          {hideNitro ? null : (
            <>
              <Flex.Item marginBottom={1}>
                <InfoTooltip
                  content={
                    <>
                      <Trans>Max Honey 🍯 multiplier</Trans>
                      <br />
                      <Typography.Link
                        target="_blank"
                        href="https://docs.teddyswap.org/docs/Honey%20Fee/"
                      >
                        <Trans>Read more</Trans>
                      </Typography.Link>
                    </>
                  }
                >
                  <Typography.Body strong>Honey 🍯</Typography.Body>
                </InfoTooltip>
              </Flex.Item>

              <Flex.Item>
                <Form.Item name="nitro">
                  {({ onChange, value, state, message }) => (
                    <NitroInput
                      minExFee={minExFee}
                      maxExFee={maxExFee}
                      state={state}
                      message={message}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                </Form.Item>
              </Flex.Item>
            </>
          )}
        </Flex>
      </Form>
    </Box>
  );

  return (
    <Popover
      content={Setting}
      trigger="click"
      placement="bottomRight"
      visible={isPopoverShown}
      onVisibleChange={handlePopoverShown}
    >
      <Button
        type="text"
        size="large"
        style={{
          backgroundColor:
            slippageCheck(slippage) || slippageTxFailCheck(slippage)
              ? 'var(--spectrum-warning-border-color)'
              : 'var(--spectrum-primary-color)',
        }}
      >
        <Flex align="center">
          <Flex.Item marginRight={2} align="center">
            <Typography.Body size="small">
              {`${slippage}% `}
              <Trans>slippage</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item align="center" style={{ paddingTop: '1px' }}>
            <SettingOutlined />
          </Flex.Item>
        </Flex>
      </Button>
    </Popover>
  );
};
