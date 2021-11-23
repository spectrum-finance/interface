import './GlobalSettings.less';

import React, { ChangeEventHandler, useState } from 'react';

import { defaultMinerFee } from '../../../constants/settings';
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
import { InfoTooltip } from '../../InfoTooltip/InfoTooltip';

const GlobalSettings = (): JSX.Element => {
  const [settings, setSettings] = useSettings();

  const [isPopoverShown, setIsPopoverShown] = useState(false);
  const handlePopoverShown = () => setIsPopoverShown((prev) => !prev);

  const [minerFee, setMinerFee] = useState(settings.minerFee);
  const [explorerUrl, setExplorerUrl] = useState(settings.explorerUrl);

  const handleChangeMinerFee: ChangeEventHandler<HTMLInputElement> = (v) => {
    setMinerFee(Number(v.target.value));
  };

  const handleChangeExplorerUrl: ChangeEventHandler<HTMLInputElement> = (v) => {
    setExplorerUrl(v.target.value);
  };

  const handleClickMinimal = () => {
    setMinerFee(defaultMinerFee);
  };

  const submitGlobalSettings = () => {
    setSettings({ ...settings, minerFee, explorerUrl });
    setIsPopoverShown(false);
  };

  const Setting: JSX.Element = (
    <Box transparent padding={4}>
      <Flex direction="col">
        <Flex.Item marginBottom={4}>
          <Typography.Title level={5}>Global Settings</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Form
            name="global-settings"
            initialValues={{
              minerFee,
            }}
          >
            <Typography.Footnote>Miner Fee</Typography.Footnote>
            <InfoTooltip content="Fee charged by miners" />
            <Flex justify="space-between">
              <Flex.Item marginRight={1}>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleClickMinimal}
                >
                  Minimal
                </Button>
              </Flex.Item>
              <Flex.Item className="global-settings__miner-fee-wrapper">
                <Form.Item name="minerFee">
                  <Input size="small" placeholder="< 0.005" suffix="ERG" />
                </Form.Item>
              </Flex.Item>
            </Flex>

            {/*<Form.Item name="explorerUrl">*/}
            {/*  <Typography.Footnote>Explorer URL</Typography.Footnote>*/}
            {/*  <InfoTooltip content="Custom explorer URL. Used for redirections to explorer." />*/}
            {/*  <Input*/}
            {/*    size="small"*/}
            {/*    placeholder="https://explorer.com"*/}
            {/*    onChange={handleChangeExplorerUrl}*/}
            {/*  />*/}
            {/*</Form.Item>*/}
          </Form>
        </Flex.Item>
        <Flex.Item>
          <Button
            type="primary"
            size="middle"
            block
            onClick={submitGlobalSettings}
          >
            Confirm
          </Button>
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

export { GlobalSettings };
