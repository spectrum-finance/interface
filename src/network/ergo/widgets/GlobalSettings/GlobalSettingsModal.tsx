import {
  Button,
  CheckFn,
  Flex,
  Form,
  FormGroup,
  Messages,
  Modal,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';

import { defaultMinerFee } from '../../../../common/constants/settings';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { patchSettings, useSettings } from '../../settings/settings';
import { MinerFeeInput } from './MinerFeeInput/MinerFeeInput';

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
    minMinerFee: t`Minimum value is ${MIN_ERG_FOR_TX} ERG`,
    maxMinerFee: t`The value can't be more than ${MAX_ERG_FOR_TX} ERG`,
  },
};

const warningMessages: Messages<GlobalSettingsFormModel> = {
  minerFee: {
    recommendedMinerFee: (value: number | undefined) =>
      t`You will spend ${value} ERG for every operation.`,
  },
};

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  onClose,
}): JSX.Element => {
  const [{ minerFee }] = useSettings();

  const form = useForm<GlobalSettingsFormModel>({
    minerFee: useForm.ctrl(
      minerFee,
      [minMinerFeeCheck, maxMinerFeeCheck],
      [recommendedMinerFeeCheck],
    ),
  });

  const submitGlobalSettings = (form: FormGroup<GlobalSettingsFormModel>) => {
    if (form.invalid) {
      return;
    }

    patchSettings({ minerFee: form.value.minerFee! });
    onClose();
  };

  return (
    <>
      <Modal.Title>
        <Trans>Global Settings</Trans>
      </Modal.Title>
      <Modal.Content width={450}>
        <Form
          form={form}
          onSubmit={submitGlobalSettings}
          errorMessages={errorMessages}
          warningMessages={warningMessages}
        >
          <Flex col>
            <Flex.Item marginBottom={4}>
              <Typography.Footnote>
                <Trans>Miner Fee</Trans>
              </Typography.Footnote>
              <InfoTooltip content="Fee charged by miners" />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Form.Item name="minerFee">
                {({ value, onChange, state, message }) => (
                  <MinerFeeInput
                    value={value}
                    onChange={onChange}
                    state={state}
                    message={message}
                  />
                )}
              </Form.Item>
            </Flex.Item>
            <Form.Listener>
              {({ invalid }) => (
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  disabled={invalid}
                >
                  <Trans>Confirm</Trans>
                </Button>
              )}
            </Form.Listener>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};

export { GlobalSettingsModal };
