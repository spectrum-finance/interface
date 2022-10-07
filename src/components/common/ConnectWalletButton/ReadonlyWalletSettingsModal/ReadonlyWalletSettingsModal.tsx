import {
  Alert,
  Button,
  Flex,
  Form,
  FormGroup,
  InfoOutlined,
  Input,
  Modal,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';

import {
  ReadonlyWallet,
  setReadonlyAddress,
} from '../../../../network/ergo/api/wallet/readonly/readonly';
import { connectWallet } from '../../../../network/ergo/api/wallet/wallet';

export interface ReadonlyWalletSettingsModalProps {
  readonly close: () => void;
}

interface ReadOnlySettingsModel {
  readonly address: string | undefined;
}

export const ReadonlyWalletSettingsModal: FC<ReadonlyWalletSettingsModalProps> =
  ({ close }) => {
    const form = useForm<ReadOnlySettingsModel>({
      address: undefined,
    });

    const connectReadOnlyWallet = (data: FormGroup<ReadOnlySettingsModel>) => {
      if (data.value.address) {
        setReadonlyAddress(data.value.address);
        connectWallet(ReadonlyWallet).subscribe(() => {
          close();
        });
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Read-only Wallet</Trans>
        </Modal.Title>
        <Modal.Content>
          <Form form={form} onSubmit={connectReadOnlyWallet}>
            <Flex col>
              <Flex.Item marginBottom={2}>
                <Alert
                  showIcon
                  type="warning"
                  message={t`Do not paste your seed phrase in this field.`}
                  style={{ width: '100%' }}
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Form.Item name="address">
                  {({ value, onChange }) => (
                    <Input
                      autoFocus={true}
                      size="large"
                      placeholder="Paste your address"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                </Form.Item>
              </Flex.Item>
              <Form.Listener name="address">
                {({ value }) => (
                  <Button
                    size="large"
                    disabled={!value}
                    htmlType="submit"
                    type="primary"
                  >
                    <Trans>Connect</Trans>
                  </Button>
                )}
              </Form.Listener>
            </Flex>
          </Form>
        </Modal.Content>
      </>
    );
  };
