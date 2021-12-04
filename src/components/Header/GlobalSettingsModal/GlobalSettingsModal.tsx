import './GlobalSettingsModal.less';

import React, { useState } from 'react';

import { defaultMinerFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Typography,
} from '../../../ergodex-cdk';
import { useObservable } from '../../../hooks/useObservable';
import { nativeToken$ } from '../../../services/new/core';
import { selectedNetwork$ } from '../../../services/new/network';
import { InfoTooltip } from '../../InfoTooltip/InfoTooltip';

interface GlobalSettingsModalProps {
  onClose: () => void;
}

interface GlobalSettingsFormModel {
  readonly minerFee?: string;
  readonly explorerUrl?: string;
}

const MAX_ERG_FOR_TX = 2;
const MAX_RECOMMENDED_ERG_FOR_TX = 0.3;

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  onClose,
}): JSX.Element => {
  const [form] = Form.useForm<GlobalSettingsFormModel>();

  const [selectedNetwork] = useObservable(selectedNetwork$);
  const [nativeToken] = useObservable(nativeToken$);
  const [settings, setSettings] = useSettings();

  const [minerFeeError, setMinerFeeError] = useState<
    { type: 'error' | 'warning'; message: string } | undefined
  >();

  const initialValues = {
    minerFee: settings.minerFee,
    explorerUrl: settings.explorerUrl,
  };

  const handleClickMinimal = () => {
    form.setFieldsValue({ minerFee: String(defaultMinerFee) || '' });
    setMinerFeeError(undefined);
  };

  const submitGlobalSettings = () => {
    const { minerFee } = form.getFieldsValue();

    if (minerFee) {
      setSettings({ ...settings, minerFee: Number(minerFee) });
      onClose();
    }
  };

  const onValuesChange = (changes: GlobalSettingsFormModel) => {
    if (!changes.minerFee) {
      setMinerFeeError({ type: 'error', message: 'Required' });
      return;
    }

    if (changes.minerFee) {
      const val = Number(changes.minerFee);

      if (isNaN(val)) {
        setMinerFeeError({
          type: 'error',
          message: `Type a valid number`,
        });
        return;
      }

      if (val >= MAX_RECOMMENDED_ERG_FOR_TX && val <= MAX_ERG_FOR_TX) {
        setMinerFeeError({
          type: 'warning',
          message: `You will spend ${val} ERG for every operation. We don't recommend use such big amounts`,
        });
        return;
      }

      if (val > MAX_ERG_FOR_TX) {
        setMinerFeeError({
          type: 'error',
          message: `The value can't be more than ${MAX_ERG_FOR_TX} ERG`,
        });
        return;
      }

      if (val < defaultMinerFee) {
        setMinerFeeError({
          type: 'error',
          message: `Minimum value is ${defaultMinerFee} ERG`,
        });
      } else {
        setMinerFeeError(undefined);
      }
    }
  };

  return (
    <>
      <Modal.Title>Global Settings</Modal.Title>
      <Modal.Content width={450}>
        <Flex col>
          <Flex.Item>
            <Form
              name="global-settings"
              form={form}
              initialValues={initialValues}
              onValuesChange={onValuesChange}
            >
              <Typography.Footnote>
                {selectedNetwork?.name === 'ergo'
                  ? 'Miner Fee'
                  : 'Transaction Fee'}
              </Typography.Footnote>
              <InfoTooltip
                content={
                  selectedNetwork?.name === 'ergo'
                    ? 'Fee charged by miners'
                    : 'Fee charged by stake pools'
                }
              />
              <Flex>
                <Flex.Item marginRight={1}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleClickMinimal}
                    block
                  >
                    Minimum
                  </Button>
                </Flex.Item>
                <Flex.Item
                  className="global-settings__miner-fee-wrapper"
                  style={{ width: '100%' }}
                >
                  <Form.Item
                    name="minerFee"
                    validateStatus={minerFeeError ? minerFeeError.type : ''}
                    help={minerFeeError ? minerFeeError.message : ''}
                  >
                    <Input
                      size="large"
                      placeholder="< 0.002"
                      autoCorrect="off"
                      autoComplete="off"
                      suffix={nativeToken?.name}
                    />
                  </Form.Item>
                </Flex.Item>
              </Flex>

              {/*<Form.Item name="explorerUrl">*/}
              {/*  <Typography.Footnote>Explorer URL</Typography.Footnote>*/}
              {/*  <InfoTooltip content="Custom explorer URL" />*/}
              {/*  <Input disabled size="large" placeholder={ERG_EXPLORER_URL} />*/}
              {/*</Form.Item>*/}
            </Form>
          </Flex.Item>
          <Flex.Item>
            <Button
              type="primary"
              size="large"
              block
              onClick={submitGlobalSettings}
              disabled={minerFeeError && minerFeeError.type === 'error'}
            >
              Confirm
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { GlobalSettingsModal };
