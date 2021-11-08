import React, { ChangeEventHandler, useState } from 'react';

import { InfoTooltip } from '../../components/InfoTooltip/InfoTooltip';
import {
  defaultMinerFee,
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../constants/settings';
import { useSettings } from '../../context';
import {
  Box,
  Button,
  Flex,
  Form,
  Input,
  Popover,
  SettingOutlined,
  Typography,
} from '../../ergodex-cdk';

const TransactionSettings = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const [form] = Form.useForm();

  const [isPopoverShown, setIsPopoverShown] = useState(false);
  const handlePopoverShown = () => setIsPopoverShown((prev) => !prev);
  // TODO: EXTRACT_WARNINGS_TO_ERGO_CDK_FORM.ITEM
  const [slippageWarning, setSlippageWarning] = useState<boolean>(false);

  const handleFormValuesChange = (changes: {
    slippage?: number;
    nitro?: number;
  }) => {
    if (changes.slippage) {
      setSettings({
        ...settings,
        slippage: changes.slippage,
      });
      if (changes.slippage > 1) {
        setSlippageWarning(true);
      }
    }
    if (changes.nitro) {
      setSettings({
        ...settings,
        nitro: changes.nitro,
      });
    }
  };

  const handleClickAuto = () => {
    form.setFieldsValue({ slippage: defaultSlippage });
    setSettings({
      ...settings,
      slippage: defaultSlippage,
    });
  };

  const Setting: JSX.Element = (
    <Box transparent padding={4}>
      <Flex flexDirection="col">
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
            }}
          >
            <Typography.Footnote>Slippage tolerance</Typography.Footnote>
            <InfoTooltip content="Distinctively monetize cost effective networks for cross-media bandwidth" />
            <Flex justify="space-between">
              <Flex.Item marginRight={1}>
                <Button type="primary" size="small" onClick={handleClickAuto}>
                  Auto
                </Button>
              </Flex.Item>
              <Flex.Item>
                <Form.Item
                  validateStatus={slippageWarning ? 'warning' : undefined}
                  help="Your transaction may be frontrun"
                  name="slippage"
                  rules={[{ required: true }]}
                >
                  <Input
                    min={SlippageMin}
                    max={SlippageMax}
                    size="small"
                    suffix="%"
                  />
                </Form.Item>
              </Flex.Item>
            </Flex>
            <Form.Item name="explorerUrl">
              <Typography.Footnote>Nitro</Typography.Footnote>
              <InfoTooltip content="Maximum DEX fee multiplier" />
              <Input size="small" />
            </Form.Item>
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
