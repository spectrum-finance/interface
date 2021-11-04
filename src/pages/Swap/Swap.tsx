import './Swap.less';

import React from 'react';

import {
  ActionForm,
  ActionFormStrategy,
} from '../../components/common/ActionForm/ActionForm';
import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../components/common/TokenControl/TokenControl';
import { TxHistory } from '../../components/common/TxHistory/TxHistory';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import {
  Button,
  Flex,
  Form,
  FormInstance,
  SettingOutlined,
  SwapOutlined,
  Typography,
} from '../../ergodex-cdk';

interface SwapFormModel {
  readonly from: TokenControlValue;
  readonly to: TokenControlValue;
}

class SwapStrategy implements ActionFormStrategy {
  actionButtonCaption(): React.ReactNode {
    return 'Swap';
  }

  getInsufficientTokenForFee(form: FormInstance): string | undefined {
    return undefined;
  }

  getInsufficientTokenForTx(form: FormInstance): string | undefined {
    return 'ERG';
  }

  isAmountNotEntered(form: FormInstance<SwapFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.from?.amount?.value || !value.to?.amount?.value;
  }

  isTokensNotSelected(form: FormInstance<SwapFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.to?.token || !value.from?.token;
  }

  request(form: FormInstance): Promise<any> {
    return Promise.resolve(undefined);
  }

  isLiquidityInsufficient(form: FormInstance<any>): boolean {
    return false;
  }
}

export const Swap = () => {
  const [form] = Form.useForm<SwapFormModel>();
  const swapStrategy = new SwapStrategy();

  const swapTokens = () => {
    form.setFieldsValue({
      from: form.getFieldsValue().to,
      to: form.getFieldsValue().from,
    });
  };

  return (
    <FormPageWrapper width={480}>
      <ActionForm
        form={form}
        strategy={swapStrategy}
        initialValues={{ from: { token: 'ERG' } }}
      >
        <Flex flexDirection="col">
          <Flex flexDirection="row" alignItems="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>Swap</Typography.Title>
            </Flex.Item>
            <Button size="large" type="text" icon={<SettingOutlined />} />
            <TxHistory />
          </Flex>
          <Flex.Item marginBottom={6}>
            <Typography.Footnote>Ergo network</Typography.Footnote>
          </Flex.Item>
          <Flex.Item marginBottom={1}>
            <TokenControlFormItem name="from" label="From" maxButton />
          </Flex.Item>
          <Flex.Item className="swap-button">
            <Button onClick={swapTokens} icon={<SwapOutlined />} size="large" />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <TokenControlFormItem name="to" label="To" />
          </Flex.Item>
        </Flex>
      </ActionForm>
    </FormPageWrapper>
  );
};
