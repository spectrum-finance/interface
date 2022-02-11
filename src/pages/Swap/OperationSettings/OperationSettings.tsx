import React, { useState } from 'react';
import { filter, skip } from 'rxjs';

import { MIN_NITRO } from '../../../common/constants/erg';
import { defaultSlippage } from '../../../common/constants/settings';
import { useSubscription } from '../../../common/hooks/useObservable';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../../context';
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
} from '../../../ergodex-cdk';
import { NitroInput } from './NitroInput/NitroInput';
import { SlippageInput } from './SlippageInput/SlippageInput';

interface SettingsModel {
  readonly slippage: number;
  readonly nitro: number;
}

const warningMessages: Messages<SettingsModel> = {
  slippage: {
    transactionFrontrun: 'Your transaction may be frontrun',
    transactionMayFail: 'Your transaction may fail',
  },
};

const errorMessages: Messages<SettingsModel> = {
  nitro: {
    minNitro: `Minimal Nitro value is ${MIN_NITRO}`,
  },
};

const slippageCheck: CheckFn<number> = (value) =>
  value > 10 ? 'transactionFrontrun' : undefined;

const slippageTxFailCheck: CheckFn<number> = (value) =>
  value < defaultSlippage ? 'transactionMayFail' : undefined;

const nitroCheck: CheckFn<number> = (value) =>
  isNaN(value) || value < MIN_NITRO ? 'minNitro' : undefined;

const OperationSettings = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const [isPopoverShown, setIsPopoverShown] = useState(false);

  const form = useForm<SettingsModel>({
    slippage: useForm.ctrl(
      settings.slippage,
      [],
      [slippageCheck, slippageTxFailCheck],
    ),
    nitro: useForm.ctrl(settings.nitro, [nitroCheck]),
  });
  const handlePopoverShown = (visible: boolean) => {
    if (!visible) {
      form.reset(
        {
          slippage: settings.slippage,
          nitro: settings.nitro,
        },
        { emitEvent: 'system' },
      );
    }
    setIsPopoverShown((prev) => !prev);
  };

  useSubscription(
    form.controls.slippage.valueChanges$.pipe(skip(1), filter(Boolean)),
    (slippage) => {
      setSettings({ ...settings, slippage });
    },
    [settings],
  );

  useSubscription(
    form.controls.nitro.valueChanges$.pipe(
      skip(1),
      filter((value) => !!value && value >= MIN_NITRO),
    ),
    (nitro) => {
      setSettings({ ...settings, nitro });
    },
    [settings],
  );

  const Setting: JSX.Element = (
    <Box transparent padding={4} width={360}>
      <Form
        form={form}
        onSubmit={() => {}}
        warningMessages={warningMessages}
        errorMessages={errorMessages}
      >
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Typography.Title level={4}>Transaction Settings</Typography.Title>
          </Flex.Item>
          <Flex.Item marginBottom={1}>
            <Typography.Body strong>Slippage tolerance</Typography.Body>
            <InfoTooltip
              width={200}
              content="Your transaction will revert if the price changes unfavorably by more than this percentage"
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
            <Typography.Body strong>Nitro</Typography.Body>
            <InfoTooltip
              content={
                <>
                  Max execution fee multiplier
                  <br />
                  <Typography.Link
                    target="_blank"
                    href="https://docs.ergodex.io/docs/protocol-overview/fees#execution-fee-formula"
                  >
                    Read more
                  </Typography.Link>
                </>
              }
            />
          </Flex.Item>
          <Flex.Item>
            <Form.Item name="nitro">
              {({ onChange, value, state, message }) => (
                <NitroInput
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

export { OperationSettings };
