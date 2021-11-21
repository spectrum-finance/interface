import './TransactionSettings.less';

import React, { ChangeEventHandler, useState } from 'react';

import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { MIN_NITRO } from '../../../constants/erg';
import {
  defaultMinerFee,
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../../constants/settings';
import { useSettings } from '../../../context';
import {
  Box,
  Button,
  Flex,
  Form,
  Input,
  Popover,
  SettingOutlined,
  Typography,
} from '../../../ergodex-cdk';

const TransactionSettings = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const [form] = Form.useForm();

  const [isPopoverShown, setIsPopoverShown] = useState(false);
  const handlePopoverShown = (visible: boolean) => {
    if (!visible) {
      form.setFieldsValue({
        slippage: settings.slippage,
        nitro: settings.nitro,
      });
      setNitroWarning(false);
    }

    setIsPopoverShown((prev) => !prev);
  };
  // TODO: EXTRACT_WARNINGS_TO_ERGO_CDK_FORM.ITEM
  const [slippageWarning, setSlippageWarning] = useState<boolean>(
    settings.slippage > 1,
  );

  const [nitroWarning, setNitroWarning] = useState<boolean>(
    +settings.nitro < MIN_NITRO,
  );

  const handleFormValuesChange = (changes: {
    slippage?: number;
    nitro?: number;
  }) => {
    if (changes.slippage) {
      setSettings({
        ...settings,
        slippage: +changes.slippage,
      });
      setSlippageWarning(changes.slippage > 1);
    }
    if (changes.nitro) {
      if (+changes.nitro >= MIN_NITRO) {
        setSettings({
          ...settings,
          nitro: +changes.nitro,
        });
        setNitroWarning(false);
      } else {
        setNitroWarning(true);
      }
    }
  };

  const handleClickSlippageAuto = () => {
    form.setFieldsValue({ slippage: defaultSlippage });
    setSettings({
      ...settings,
      slippage: defaultSlippage,
    });
    setSlippageWarning(false);
  };

  const handleClickNitroAuto = () => {
    form.setFieldsValue({ nitro: MIN_NITRO });
    setSettings({
      ...settings,
      nitro: MIN_NITRO,
    });
    setSlippageWarning(false);
  };

  const Setting: JSX.Element = (
    <Box transparent padding={4}>
      <Flex flexDirection="col" style={{ width: 288 }}>
        <Flex.Item marginBottom={4}>
          <Typography.Title level={5}>Transaction Settings</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Form
            form={form}
            name="global-settings"
            onValuesChange={handleFormValuesChange}
            initialValues={{
              slippage: settings.slippage,
              nitro: settings.nitro,
            }}
          >
            <Typography.Footnote>Slippage tolerance</Typography.Footnote>
            <InfoTooltip content="Distinctively monetize cost effective networks for cross-media bandwidth" />
            <Flex justify="space-between">
              <Flex.Item marginRight={1}>
                <Button
                  style={{ width: 47 }}
                  type="primary"
                  size="small"
                  onClick={handleClickSlippageAuto}
                >
                  Auto
                </Button>
              </Flex.Item>
              <Flex.Item flex={1}>
                <Form.Item
                  className="transaction-settings_form-item"
                  validateStatus={slippageWarning ? 'warning' : undefined}
                  help={
                    slippageWarning
                      ? 'Your transaction may be frontrun'
                      : undefined
                  }
                  name="slippage"
                >
                  <Input
                    type="number"
                    min={SlippageMin}
                    max={SlippageMax}
                    size="small"
                    suffix="%"
                  />
                </Form.Item>
              </Flex.Item>
            </Flex>
            <Typography.Footnote>Nitro</Typography.Footnote>
            <InfoTooltip content="Maximum DEX fee multiplier" />
            <Flex justify="space-between">
              <Flex.Item marginRight={1}>
                <Button
                  style={{ width: 47 }}
                  type="primary"
                  size="small"
                  onClick={handleClickNitroAuto}
                >
                  Auto
                </Button>
              </Flex.Item>
              <Flex.Item flex={1}>
                <Form.Item
                  className="transaction-settings_form-item"
                  validateStatus={nitroWarning ? 'error' : undefined}
                  help={nitroWarning ? 'Minimal Nitro value is 1.2' : undefined}
                  name="nitro"
                >
                  <Input type="number" min={MIN_NITRO} size="small" />
                </Form.Item>
              </Flex.Item>
            </Flex>
          </Form>
        </Flex.Item>
      </Flex>
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

export { TransactionSettings };
