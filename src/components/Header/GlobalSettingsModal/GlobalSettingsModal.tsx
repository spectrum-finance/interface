import './GlobalSettingsModal.less';

import React from 'react';

import { defaultMinerFee } from '../../../common/constants/settings';
import { useSettings } from '../../../context';
import {
  Button,
  CheckFn,
  Flex,
  Form,
  FormGroup,
  Input,
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
        <Form form={form} onSubmit={submitGlobalSettings}>
          <Flex col>
            <Flex.Item>
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
                    {({
                      value,
                      onChange,
                      warningMessage,
                      withWarnings,
                      errorMessage,
                      invalid,
                    }) => (
                      <Input
                        size="large"
                        placeholder="> 0.002"
                        type="number"
                        value={value}
                        onChange={(test: any) => {
                          console.log(test.target.valueAsNumber);
                          onChange(test.target.valueAsNumber);
                        }}
                        state={
                          withWarnings
                            ? 'warning'
                            : invalid
                            ? 'error'
                            : undefined
                        }
                        autoCorrect="off"
                        autoComplete="off"
                        suffix="ERG"
                      />
                    )}
                  </Form.Item>
                </Flex.Item>
              </Flex>

              {/*<Form.Item name="explorerUrl">*/}
              {/*  <Typography.Footnote>Explorer URL</Typography.Footnote>*/}
              {/*  <InfoTooltip content="Custom explorer URL" />*/}
              {/*  <Input disabled size="large" placeholder={ERG_EXPLORER_URL} />*/}
              {/*</Form.Item>*/}
            </Flex.Item>
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
