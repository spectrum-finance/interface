import './Swap.less';

import React, { FC, useEffect } from 'react';

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
  Box,
  Button,
  Flex,
  Form,
  FormInstance,
  SettingOutlined,
  SwapOutlined,
  Typography,
} from '../../ergodex-cdk';
import { useObservable, useObservableAction } from '../../hooks/useObservable';
import { assets$, getAssetsByPairAsset } from '../../services/new/assets';
import { pools$ } from '../../services/new/pools';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
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

    return !value.to?.asset || !value.from?.asset;
  }

  request(form: FormInstance): Promise<any> {
    return Promise.resolve(undefined);
  }

  isLiquidityInsufficient(form: FormInstance<any>): boolean {
    return false;
  }
}

const getAssetsByToken = (pairAssetId?: string) =>
  pairAssetId ? getAssetsByPairAsset(pairAssetId) : pools$;

const initialValues: SwapFormModel = {
  from: {
    asset: {
      name: 'ERG',
      id: '0000000000000000000000000000000000000000000000000000000000000000',
    },
  },
};

export const Swap: FC = () => {
  const [form] = Form.useForm<SwapFormModel>();
  const swapStrategy = new SwapStrategy();
  const [fromAssets] = useObservable(assets$);
  const [toAssets, updateToAssets] = useObservableAction(getAssetsByToken);

  useEffect(() => {
    updateToAssets(initialValues.from?.asset?.id);
  }, [updateToAssets]);

  const onValuesChange = (_: any, value: SwapFormModel) => {
    updateToAssets(value?.from?.asset?.id);
  };

  const swapTokens = () => {
    form.setFieldsValue({
      from: form.getFieldsValue().to,
      to: form.getFieldsValue().from,
    });
  };

  const priceTooltip = (
    <>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Minimum received
        </Typography.Text>
        <Typography.Text className="price-content__right">
          0.044WETH
        </Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Price impact
        </Typography.Text>
        <Typography.Text className="price-content__right">0.5%</Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Slippage tollerance
        </Typography.Text>
        <Typography.Text className="price-content__right">0.5%</Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Total fees
        </Typography.Text>
        <Typography.Text className="price-content__right">
          0.000055ERG(~$3.065)
        </Typography.Text>
      </Box>
    </>
  );

  return (
    <FormPageWrapper width={480}>
      <ActionForm
        form={form}
        strategy={swapStrategy}
        onValuesChange={onValuesChange}
        initialValues={initialValues}
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
            <TokenControlFormItem
              assets={fromAssets}
              name="from"
              label="From"
              maxButton
            />
          </Flex.Item>
          <Flex.Item className="swap-button">
            <Button onClick={swapTokens} icon={<SwapOutlined />} size="large" />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <TokenControlFormItem assets={toAssets} name="to" label="To" />
          </Flex.Item>
        </Flex>
      </ActionForm>
    </FormPageWrapper>
  );
};
