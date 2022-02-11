import './GlobalSettingsModal.less';

import React, { ChangeEvent } from 'react';

import { defaultMinerFee } from '../../../common/constants/settings';
import { useSettings } from '../../../context';
import {
  Alert,
  Animation,
  Button,
  CheckFn,
  Flex,
  Form,
  FormGroup,
  Input,
  Messages,
  Modal,
  Typography,
  useForm,
} from '../../../ergodex-cdk';
import { InfoTooltip } from '../../InfoTooltip/InfoTooltip';

interface GlobalSettingsModalProps {
  onClose: () => void;
}

interface GlobalSettingsFormModel {
  readonly minerFee?: number;
  readonly explorerUrl?: string;
}

const MAX_ERG_FOR_TX = 2;
const MAX_RECOMMENDED_ERG_FOR_TX = 0.3;
const MIN_ERG_FOR_TX = defaultMinerFee;

const minMinerFeeCheck: CheckFn<number> = (minerFee) =>
  minerFee < MIN_ERG_FOR_TX ? 'minMinerFee' : undefined;

const maxMinerFeeCheck: CheckFn<number> = (minerFee) =>
  minerFee > MAX_ERG_FOR_TX ? 'maxMinerFee' : undefined;

const recommendedMinerFeeCheck: CheckFn<number> = (minerFee) =>
  minerFee >= MAX_RECOMMENDED_ERG_FOR_TX && minerFee <= MAX_ERG_FOR_TX
    ? 'recommendedMinerFee'
    : undefined;

const errorMessages: Messages<GlobalSettingsFormModel> = {
  minerFee: {
    minMinerFee: `Minimum value is ${MIN_ERG_FOR_TX} ERG`,
    maxMinerFee: `The value can't be more than ${MAX_ERG_FOR_TX} ERG`,
  },
};

const warningMessages: Messages<GlobalSettingsFormModel> = {
  minerFee: {
    recommendedMinerFee: (value: number | undefined) =>
      `You will spend ${value} ERG for every operation.`,
  },
};

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  onClose,
}): JSX.Element => {
  const [settings, setSettings] = useSettings();

  const form = useForm<GlobalSettingsFormModel>({
    minerFee: useForm.ctrl(
      settings.minerFee,
      [minMinerFeeCheck, maxMinerFeeCheck],
      [recommendedMinerFeeCheck],
    ),
  });

  const handleMinimalBtnClick = () => {
    form.controls.minerFee.patchValue(defaultMinerFee);
  };

  const submitGlobalSettings = (form: FormGroup<GlobalSettingsFormModel>) => {
    if (form.invalid) {
      return;
    }

    setSettings({ ...settings, minerFee: form.value.minerFee! });
    onClose();
  };

  return (
    <>
      <Modal.Title>Global Settings</Modal.Title>
      <Modal.Content width={450}>
        <Form
          form={form}
          onSubmit={submitGlobalSettings}
          errorMessages={errorMessages}
          warningMessages={warningMessages}
        >
          <Flex col>
            <Flex.Item marginBottom={4}>
              <Typography.Footnote>Miner Fee</Typography.Footnote>
              <InfoTooltip content="Fee charged by miners" />
              <Flex>
                <Flex.Item marginRight={1}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleMinimalBtnClick}
                    block
                  >
                    Minimum
                  </Button>
                </Flex.Item>
                <Flex.Item
                  className="global-settings__miner-fee-wrapper"
                  style={{ width: '100%' }}
                >
                  <Form.Item name="minerFee">
                    {({ value, onChange, state }) => (
                      <Input
                        size="large"
                        placeholder="> 0.002"
                        type="number"
                        value={value}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          onChange(event.target.valueAsNumber);
                        }}
                        state={state}
                        autoCorrect="off"
                        autoComplete="off"
                        suffix="ERG"
                      />
                    )}
                  </Form.Item>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Form.Listener name="minerFee">
              {({ message, state }) => (
                <Flex.Item marginBottom={!!message ? 4 : 0}>
                  <Animation.Expand expanded={!!message}>
                    {message && (
                      <Alert showIcon type={state} message={message} />
                    )}
                  </Animation.Expand>
                </Flex.Item>
              )}
            </Form.Listener>
            <Flex.Item>
              <Form.Listener>
                {({ invalid }) => (
                  <Button
                    type="primary"
                    size="large"
                    block
                    htmlType="submit"
                    disabled={invalid}
                  >
                    Confirm
                  </Button>
                )}
              </Form.Listener>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};

export { GlobalSettingsModal };
