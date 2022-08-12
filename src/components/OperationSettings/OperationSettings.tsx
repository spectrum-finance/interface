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
import React, { FC, useState } from 'react';
import { filter, skip } from 'rxjs';

import { MIN_NITRO } from '../../common/constants/erg';
import { defaultSlippage, MIN_SLIPPAGE } from '../../common/constants/settings';
import { useSubscription } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { NitroInput } from './NitroInput/NitroInput';
import { SlippageInput } from './SlippageInput/SlippageInput';

interface SettingsModel {
  readonly slippage: number;
  readonly nitro: number;
}

const warningMessages: Messages<SettingsModel> = {
  slippage: {
    transactionFrontrun: t`Your transaction may be frontrun`,
    transactionMayFail: t`Your transaction may fail`,
  },
};

const errorMessages: Messages<SettingsModel> = {
  nitro: {
    minNitro: t`Minimal Nitro value is ${MIN_NITRO}`,
  },
  slippage: {
    minSlippage: t`Minimal Slippage is ${MIN_SLIPPAGE}`,
  },
};

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
  readonly nitro: number;
  readonly slippage: number;
}

export const OperationSettings: FC<OperationSettingsProps> = ({
  minExFee,
  maxExFee,
  setSlippage,
  setNitro,
  nitro,
  slippage,
}) => {
  const [isPopoverShown, setIsPopoverShown] = useState(false);

  const form = useForm<SettingsModel>({
    slippage: useForm.ctrl(
      slippage,
      [minSlippageCheck],
      [slippageCheck, slippageTxFailCheck],
    ),
    nitro: useForm.ctrl(nitro, [nitroCheck]),
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
          <Flex.Item marginBottom={1}>
            <Typography.Body strong>
              <Trans>Slippage tolerance</Trans>
            </Typography.Body>
            <InfoTooltip
              width={200}
              content={t`Your transaction will revert if the price changes unfavorably by more than this percentage`}
            />
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
          <Flex.Item marginBottom={1}>
            <Typography.Body strong>
              <Trans>Nitro</Trans>
            </Typography.Body>
            <InfoTooltip
              content={
                <>
                  <Trans>Max execution fee multiplier</Trans>
                  <br />
                  <Typography.Link
                    target="_blank"
                    href="https://docs.spectrum.fi/docs/protocol-overview/fees#execution-fee-formula"
                  >
                    <Trans>Read more</Trans>
                  </Typography.Link>
                </>
              }
            />
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
      <Button type="text" size="large" icon={<SettingOutlined />} />
    </Popover>
  );
};
