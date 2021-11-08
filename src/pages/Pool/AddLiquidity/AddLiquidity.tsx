import './AddLiquidity.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount, AssetInfo } from '@ergolabs/ergo-sdk';
import React, { useEffect, useState } from 'react';
import { map, Observable, of, switchMap } from 'rxjs';

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
import {
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';
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
    // TODO: ADD VALIDATION
    return undefined;
  }

  getInsufficientTokenForTx(
    form: FormInstance<AddLiquidityFormModel>,
  ): Observable<string | undefined> | string | undefined {
    // const { x, y, xAmount, yAmount } = form.getFieldsValue();
    // const xAmountValue = xAmount?.amount?.value;
    // const yAmountValue = yAmount?.amount?.value;
    //
    // if (x && xAmountValue && y && yAmountValue) {
    //   return getTokenBalance(x.id).pipe(
    //     switchMap((balance) =>
    //       xAmountValue > balance
    //         ? of(x.name)
    //         : getTokenBalance(y.id).pipe(
    //             map((balance) => (yAmountValue > balance ? y.name : undefined)),
    //           ),
    //     ),
    //   );
    // }

    return undefined;
  }

  isAmountNotEntered(form: FormInstance<AddLiquidityFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.xAmount?.amount?.value || !value.yAmount?.amount?.value;
  }

  isTokensNotSelected(form: FormInstance<AddLiquidityFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.activePool;
  }

  request(form: FormInstance<AddLiquidityFormModel>): void {
    const value = form.getFieldsValue();

    Modal.open(
      ({ close }) => (
        <AddLiquidityConfirmationModal
          position={value.activePool}
          pair={{
            assetX: {
              name: value.xAmount?.asset?.name,
              amount: value.xAmount?.amount?.value,
            },
            assetY: {
              name: value.yAmount?.asset?.name,
              amount: value.yAmount?.amount?.value,
            },
          }}
          onClose={close}
        />
      ),
      {
        title: 'Add liquidity',
        width: 436,
      },
    );
  }

  isLiquidityInsufficient(): boolean {
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

  const [isPairSelected, setIsPairSelected] = useState(false);

  const onValuesChange = (
    changes: AddLiquidityFormModel,
    value: AddLiquidityFormModel,
  ) => {
    setYAssets(value?.x?.id);

    if (value?.activePool && isStickRatio) {
      if (changes?.xAmount) {
        const newYAsset = value.activePool.depositAmount(
          new AssetAmount(
            changes.xAmount?.asset as AssetInfo,
            parseUserInputToFractions(
              changes.xAmount?.amount?.value ?? 0,
              changes.xAmount?.asset?.decimals,
            ),
          ),
        );

        form.setFieldsValue({
          yAmount: {
            amount: {
              viewValue: renderFractions(
                newYAsset.amount,
                newYAsset.asset.decimals,
              ),
              value: Number(
                renderFractions(newYAsset.amount, newYAsset.asset.decimals),
              ),
            },
          },
        });
      }

      if (changes?.yAmount) {
        const newXAsset = value.activePool.depositAmount(
          new AssetAmount(
            changes.yAmount?.asset as AssetInfo,
            parseUserInputToFractions(
              changes.yAmount?.amount?.value ?? 0,
              changes.yAmount?.asset?.decimals,
            ),
          ),
        );

        form.setFieldsValue({
          xAmount: {
            amount: {
              viewValue: renderFractions(
                newXAsset.amount,
                newXAsset.asset.decimals,
              ),
              value: Number(
                renderFractions(newXAsset.amount, newXAsset.asset.decimals),
              ),
            },
          },
        });
      }
    }

    if (changes?.activePool) {
      form.setFieldsValue({
        xAmount: { asset: changes.activePool.assetX },
        yAmount: { asset: changes.activePool.assetY },
      });
    }

    if (value?.x && value?.y) {
      setPools(value.x.id, value.y.id);
      setIsPairSelected(true);
    }
  };

  useEffect(() => {
    setYAssets(initialValues?.x?.id);
    form.setFieldsValue({ xAmount: { asset: initialValues?.x } });
  });

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
          <Flex.Item
            marginBottom={4}
            style={{ opacity: isPairSelected ? '' : '0.3' }}
          >
            <Typography.Body strong>Select Pool</Typography.Body>
            <Form.Item name="activePool" style={{ marginBottom: 0 }}>
              <PoolSelect positions={pools} />
            </Form.Item>
          </Flex.Item>
          <Flex.Item
            marginBottom={4}
            style={{ opacity: isPairSelected ? '' : '0.3' }}
          >
            <Typography.Body strong>Liquidity</Typography.Body>
            <Flex flexDirection="col">
              <Flex.Item marginBottom={1}>
                <TokenControlFormItem
                  disabled={!isPairSelected}
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
                    disabled={!isPairSelected}
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
                  disabled={!isPairSelected}
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
