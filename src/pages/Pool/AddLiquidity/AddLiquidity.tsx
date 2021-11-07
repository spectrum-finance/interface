import './AddLiquidity.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect, useState } from 'react';

import {
  ActionForm,
  ActionFormStrategy,
} from '../../../components/common/ActionForm/ActionForm';
import { PoolSelect } from '../../../components/common/PoolSelect/PoolSelect';
import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../../components/common/TokenControl/TokenControl';
import { TokeSelectFormItem } from '../../../components/common/TokenControl/TokenSelect/TokenSelect';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import {
  Button,
  Flex,
  Form,
  FormInstance,
  LinkOutlined,
  Modal,
  Tooltip,
  Typography,
} from '../../../ergodex-cdk';
import {
  useObservable,
  useObservableAction,
} from '../../../hooks/useObservable';
import { assets$, getAssetsByPairAsset } from '../../../services/new/assets';
import { getPoolByPair, pools$ } from '../../../services/new/pools';
import { AddLiquidityConfirmationModal } from './AddLiquidityConfirmationModal/AddLiquidityConfirmationModal';

interface AddLiquidityFormModel {
  readonly x?: TokenControlValue['asset'];
  readonly y?: TokenControlValue['asset'];
  readonly xAmount?: TokenControlValue;
  readonly yAmount?: TokenControlValue;
  readonly activePool?: AmmPool;
}

class AddLiquidityStrategy implements ActionFormStrategy {
  actionButtonCaption(): React.ReactNode {
    return 'Add liquidity';
  }

  getInsufficientTokenForFee(form: FormInstance): string | undefined {
    return undefined;
  }

  getInsufficientTokenForTx(
    form: FormInstance<AddLiquidityFormModel>,
  ): string | undefined {
    const value = form.getFieldsValue();
    return 'ERG';
  }

  isAmountNotEntered(form: FormInstance<AddLiquidityFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.xAmount?.amount?.value || !value.yAmount?.amount?.value;
  }

  isTokensNotSelected(form: FormInstance<AddLiquidityFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.activePool;
  }

  request(form: FormInstance<AddLiquidityFormModel>): Promise<any> {
    const value = form.getFieldsValue();

    return Promise.resolve(() => {
      Modal.open(
        ({ close }) => (
          // TODO: remove mocks
          <AddLiquidityConfirmationModal
            pair={{
              assetX: { name: value.xAmount?.asset?.name, amount: 1.23 },
              assetY: { name: 'SigUSD', amount: 3.23 },
            }}
            onClose={close}
          />
        ),
        {
          title: 'Add liquidity',
          width: 436,
        },
      );
    });
  }

  isLiquidityInsufficient(form: FormInstance<any>): boolean {
    return false;
  }
}

const initialValues: AddLiquidityFormModel = {
  x: {
    name: 'ERG',
    id: '0000000000000000000000000000000000000000000000000000000000000000',
  },
};

const getAssetsByToken = (tokenId?: string) =>
  tokenId ? getAssetsByPairAsset(tokenId) : pools$;

const AddLiquidity = (): JSX.Element => {
  const addLiquidityStrategy = new AddLiquidityStrategy();
  const [form] = Form.useForm<AddLiquidityFormModel>();
  const [xAssets] = useObservable(assets$);
  const [yAssets, setYAssets] = useObservableAction(getAssetsByToken);
  const [pools, setPools] = useObservableAction(getPoolByPair);

  const [isStickRatio, setIsStickRatio] = useState(false);

  const onValuesChange = (
    changes: AddLiquidityFormModel,
    value: AddLiquidityFormModel,
  ) => {
    setYAssets(value?.x?.id);

    if (changes?.activePool) {
      form.setFieldsValue({
        xAmount: { asset: changes.activePool.assetX },
        yAmount: { asset: changes.activePool.assetY },
      });
    }

    if (value?.x && value?.y) {
      setPools(value.x.id, value.y.id);
    }
  };

  useEffect(() => {
    setYAssets(initialValues?.x?.id);
  }, [setYAssets]);

  const handleOpenConfirmationModal = () => {
    Modal.open(
      ({ close }) => (
        // TODO: remove mocks
        <AddLiquidityConfirmationModal
          pair={{
            assetX: { name: 'ERG', amount: 1.23 },
            assetY: { name: 'SigUSD', amount: 3.23 },
          }}
          onClose={close}
        />
      ),
      {
        title: 'Add liquidity',
        width: 436,
      },
    );
  };

  return (
    <FormPageWrapper
      title="Add liquidity"
      width={480}
      withBackButton
      backTo="/pool"
    >
      <ActionForm
        form={form}
        strategy={addLiquidityStrategy}
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        <button onClick={handleOpenConfirmationModal}>modal</button>
        <Flex flexDirection="col">
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>Select Pair</Typography.Body>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item marginRight={2} grow>
                <TokeSelectFormItem name="x" assets={xAssets} />
              </Flex.Item>
              <Flex.Item grow>
                <TokeSelectFormItem name="y" assets={yAssets} />
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Typography.Body strong>Select Pool</Typography.Body>
            <Form.Item name="activePool" style={{ marginBottom: 0 }}>
              <PoolSelect positions={pools} />
            </Form.Item>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body strong>Liquidity</Typography.Body>
            <Flex flexDirection="col">
              <Flex.Item marginBottom={1}>
                <TokenControlFormItem
                  name="xAmount"
                  assets={xAssets}
                  hasBorder={isStickRatio}
                />
              </Flex.Item>
              <Flex.Item className="stick-button">
                <Tooltip
                  title={`${
                    isStickRatio ? 'Unstick' : 'Stick to'
                  } current ratio`}
                >
                  <Button
                    type={isStickRatio ? 'primary' : 'default'}
                    className="stick-button__btn"
                    icon={<LinkOutlined />}
                    onClick={() => setIsStickRatio((val) => !val)}
                    size="large"
                  />
                </Tooltip>
              </Flex.Item>
              <Flex.Item>
                <TokenControlFormItem
                  name="yAmount"
                  assets={yAssets}
                  hasBorder={isStickRatio}
                />
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
      </ActionForm>
    </FormPageWrapper>
  );
};
export { AddLiquidity };
