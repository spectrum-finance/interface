import {
  Button,
  Flex,
  Form,
  FormGroup,
  Input,
  useDevice,
  useForm,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { Section } from '../../../../../../../Section/Section';

interface TransactionFindFormModel {
  readonly txId?: string;
}

interface TransactionFindFormProps {
  readonly onSubmit: (txId: string) => void;
  readonly loading?: boolean;
}

export const TransactionFindForm: FC<TransactionFindFormProps> = ({
  loading,
  onSubmit,
}) => {
  const { valBySize } = useDevice();
  const form = useForm<TransactionFindFormModel>({
    txId: undefined,
  });

  const handleSubmit = ({
    value: { txId },
  }: FormGroup<TransactionFindFormModel>) => {
    if (!txId) {
      return;
    }
    onSubmit(txId);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Flex col>
        <Section
          title={t`Transaction id`}
          tooltip={t`Learn how to get transaction id`}
        >
          <Flex direction={valBySize('col', 'row')}>
            <Flex.Item
              flex={1}
              marginRight={valBySize(0, 2)}
              marginBottom={valBySize(4, 0)}
            >
              <Form.Item name="txId">
                {({ value, onChange }) => (
                  <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    size="large"
                    placeholder={t`Paste transaction id`}
                  />
                )}
              </Form.Item>
            </Flex.Item>
            <Form.Listener name="txId">
              {({ value }) => (
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={!value}
                  loading={loading}
                >
                  {t`Refund transaction`}
                </Button>
              )}
            </Form.Listener>
          </Flex>
        </Section>
      </Flex>
    </Form>
  );
};
