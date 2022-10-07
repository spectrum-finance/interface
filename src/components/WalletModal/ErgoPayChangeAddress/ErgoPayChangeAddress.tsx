import {
  Alert,
  Button,
  Flex,
  Form,
  FormGroup,
  Input,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { setReadonlyAddress } from '../../../network/ergo/api/wallet/readonly/readonly';

interface ChangeAddressFormModel {
  readonly address: string | undefined;
}

export const ErgoPayChangeAddress: FC = () => {
  const form = useForm<ChangeAddressFormModel>({
    address: undefined,
  });

  const changeAddress = (formGroup: FormGroup<ChangeAddressFormModel>) => {
    if (formGroup.value.address) {
      setReadonlyAddress(formGroup.value.address);
      formGroup.patchValue({ address: undefined });
    }
  };

  return (
    <Form form={form} onSubmit={changeAddress}>
      <Flex col>
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
                  placeholder="Paste your address"
                  size="large"
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
                <Trans>Change address</Trans>
              </Button>
            )}
          </Form.Listener>
        </Flex>
      </Flex>
    </Form>
  );
};
