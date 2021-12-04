/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import './Swap.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Observable, of } from 'rxjs';

import {
  ActionForm,
  ActionFormStrategy,
} from '../../components/common/ActionForm/ActionForm';
import {
  TokenControlFormItem,
  TokenControlValue,
} from '../../components/common/TokenControl/TokenControl';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import {
  ERG_DECIMALS,
  ERG_TOKEN_ID,
  ERG_TOKEN_NAME,
  UI_FEE,
} from '../../constants/erg';
import { defaultExFee } from '../../constants/settings';
import { useSettings } from '../../context';
import {
  Button,
  Flex,
  Form,
  FormInstance,
  SwapOutlined,
  Typography,
} from '../../ergodex-cdk';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../hooks/useObservable';
import { assets$, getAssetsByPairAsset } from '../../services/new/assets';
import { Balance, useWalletBalance } from '../../services/new/balance';
import { nativeToken$ } from '../../services/new/core';
import { selectedNetwork$ } from '../../services/new/network';
import { getPoolByPair, pools$ } from '../../services/new/pools';
import { fractionsToNum, parseUserInputToFractions } from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';
import { Ratio } from './Ratio/Ratio';
import { SwapConfirmationModal } from './SwapConfirmationModal/SwapConfirmationModal';
import { SwapTooltip } from './SwapTooltip/SwapTooltip';
import { TransactionSettings } from './TransactionSettings/TransactionSettings';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
  readonly pool?: AmmPool;
}

class SwapStrategy implements ActionFormStrategy {
  constructor(private balance: Balance, private minerFee: number) {}

  actionButtonCaption(): React.ReactNode {
    return 'Swap';
  }

  getInsufficientTokenForFee(
    form: FormInstance<SwapFormModel>,
  ): string | undefined {
    const { from } = form.getFieldsValue();
    let totalFees = +calculateTotalFee(
      [this.minerFee, UI_FEE, defaultExFee],
      ERG_DECIMALS,
    );
    totalFees =
      from?.asset?.id === ERG_TOKEN_ID
        ? totalFees + from.amount?.value!
        : totalFees;

    return +totalFees > this.balance.get(ERG_TOKEN_ID)
      ? ERG_TOKEN_NAME
      : undefined;
  }

  getInsufficientTokenForTx(
    form: FormInstance<SwapFormModel>,
  ): Observable<string | undefined> | string | undefined {
    const { from } = form.getFieldsValue();
    const asset = from?.asset;
    const amount = from?.amount?.value;

    if (asset && amount && amount > this.balance.get(asset)) {
      return asset.name;
    }

    return undefined;
  }

  isAmountNotEntered(form: FormInstance<SwapFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.from?.amount?.value || !value.to?.amount?.value;
  }

  isTokensNotSelected(form: FormInstance<SwapFormModel>): boolean {
    const value = form.getFieldsValue();

    return !value.to?.asset || !value.from?.asset;
  }

  request(form: FormInstance): void {
    const value = form.getFieldsValue();

    openConfirmationModal(
      (next) => {
        return <SwapConfirmationModal value={value} onClose={next} />;
      },
      Operation.SWAP,
      { asset: value.from?.asset!, amount: value?.from?.amount?.value! },
      { asset: value.to?.asset!, amount: value?.to?.amount?.value! },
    );
  }

  isLiquidityInsufficient(form: FormInstance<SwapFormModel>): boolean {
    const { to, pool } = form.getFieldsValue();

    if (!to?.amount?.value || !pool) {
      return false;
    }

    return (
      to.amount.value > fractionsToNum(pool?.y.amount, pool?.y.asset.decimals)
    );
  }
}

const getAssetsByToken = (pairAssetId?: string) =>
  pairAssetId ? getAssetsByPairAsset(pairAssetId) : pools$;

const initialValues: SwapFormModel = {
  from: {
    asset: {
      name: 'ERG',
      id: '0000000000000000000000000000000000000000000000000000000000000000',
      decimals: ERG_DECIMALS,
    },
  },
};

const fromToTo = (fromValue: TokenControlValue, pool: AmmPool): number => {
  const toAmount = pool.outputAmount(
    new AssetAmount(
      fromValue.asset!,
      parseUserInputToFractions(
        fromValue.amount?.value!,
        fromValue.asset?.decimals,
      ),
    ),
  );

  return fractionsToNum(toAmount.amount, toAmount.asset?.decimals);
};

const toToFrom = (
  toValue: TokenControlValue,
  pool: AmmPool,
): number | undefined => {
  const fromAmount = pool.inputAmount(
    new AssetAmount(
      toValue.asset!,
      parseUserInputToFractions(
        toValue.amount?.value!,
        toValue.asset?.decimals,
      ),
    ),
  );

  return fromAmount
    ? fractionsToNum(fromAmount.amount, fromAmount.asset?.decimals)
    : undefined;
};

const isFromFieldAssetChanged = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean => value?.from?.asset?.id !== prevValue?.from?.asset?.id;

const isToAssetChanged = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean =>
  !!value?.from?.asset &&
  !!value?.to?.asset &&
  value?.to?.asset?.id !== prevValue?.to?.asset?.id;

const getAvailablePools = (xId?: string, yId?: string): Observable<AmmPool[]> =>
  xId && yId ? getPoolByPair(xId, yId) : of([]);

const isFromAmountChangedWithEmptyPool = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean => !value?.pool && value?.from?.amount !== prevValue?.from?.amount;

const isToAmountChangedWithEmptyPool = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean => !value?.pool && value?.to?.amount !== prevValue?.to?.amount;

const isFromAmountChangedWithActivePool = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean => !!value?.pool && value?.from?.amount !== prevValue?.from?.amount;

const isToAmountChangedWithActivePool = (
  value: SwapFormModel,
  prevValue: SwapFormModel,
): boolean => !!value?.pool && value?.to?.amount !== prevValue?.to?.amount;

const sortPoolByLpDesc = (poolA: AmmPool, poolB: AmmPool) =>
  fractionsToNum(poolB.lp.amount) - fractionsToNum(poolA.lp.amount);

export const Swap: FC = () => {
  const [form] = Form.useForm<SwapFormModel>();
  const [fromAssets] = useObservable(assets$);
  const [toAssets, updateToAssets] = useSubject(getAssetsByToken);
  const [pools, updatePoolsByPair] = useSubject(getAvailablePools);
  const { t } = useTranslation();
  const [balance] = useWalletBalance();
  const [{ minerFee }] = useSettings();
  const [, setChanges] = useState<any>();
  const [selectedNetwork] = useObservable(selectedNetwork$);
  const [nativeToken] = useObservable(nativeToken$);

  const swapStrategy = new SwapStrategy(balance, minerFee);

  useEffect(() => {
    form.resetFields(['from', 'to']);
    form.setFieldsValue({
      from: {
        asset: {
          name: nativeToken?.name,
          id: nativeToken?.id as any,
          decimals: ERG_DECIMALS,
        },
      },
    });
  }, [
    form,
    nativeToken?.id,
    nativeToken?.name,
    selectedNetwork,
    updateToAssets,
  ]);

  useEffect(() => {
    updateToAssets(initialValues.from?.asset?.id);
  }, [updateToAssets]);

  useEffect(() => {
    const { pool, to, from } = form.getFieldsValue();
    const newPool = pools?.slice().sort(sortPoolByLpDesc)[0];

    if (!pool || pool.id !== newPool?.id) {
      const fromAmount =
        !from?.amount && to?.amount && newPool
          ? {
              value: toToFrom(to, newPool),
              viewValue: toToFrom(to, newPool)?.toString(),
            }
          : from?.amount;
      const toAmount =
        from?.amount && newPool
          ? {
              value: fromToTo(from, newPool),
              viewValue: fromToTo(from, newPool).toString(),
            }
          : to?.amount;

      form.setFieldsValue({
        pool: newPool,
        from: { ...from, amount: fromAmount },
        to: { ...to, amount: toAmount },
      });
      setChanges({});
    }
  }, [pools, form]);

  const onValuesChange = (
    changes: SwapFormModel,
    value: SwapFormModel,
    prevValue: SwapFormModel,
  ) => {
    if (isFromFieldAssetChanged(value, prevValue)) {
      updateToAssets(value?.from?.asset?.id);
      form.setFieldsValue({ to: undefined, pool: undefined });
      updatePoolsByPair();
    }
    if (isToAssetChanged(value, prevValue)) {
      updatePoolsByPair(value?.from?.asset?.id!, value?.to?.asset?.id!);
    }
    if (isFromAmountChangedWithEmptyPool(value, prevValue)) {
      form.setFieldsValue({ to: undefined });
    }
    if (isToAmountChangedWithEmptyPool(value, prevValue)) {
      form.setFieldsValue({ from: { ...value.from, amount: undefined } });
    }
    if (isFromAmountChangedWithActivePool(value, prevValue)) {
      const toAmount = fromToTo(value.from!, value.pool!);
      form.setFieldsValue({
        to: {
          ...value.to,
          amount: { value: toAmount, viewValue: toAmount.toString() },
        },
      });
    }
    if (isToAmountChangedWithActivePool(value, prevValue)) {
      const fromAmount = toToFrom(value.to!, value.pool!);
      form.setFieldsValue({
        from: {
          ...value.from,
          amount: { value: fromAmount, viewValue: fromAmount?.toString() },
        },
      });
    }
    // if (
    //   value.from &&
    //   value.from?.amount?.value &&
    //   value.to?.amount?.value &&
    //   value.from?.asset &&
    //   value.to?.asset &&
    //   value.pool
    // ) {
    //   setRatio(calculateRatio(value));
    // }
    setChanges({});
  };

  const swapTokens = () => {
    const { to, from } = form.getFieldsValue();

    // TODO: REPLACE_WITH_SET_FIELDS_VALUES
    form.setFields([
      { name: 'from', value: to },
      { name: 'to', value: from },
    ]);
    setChanges({});
  };

  return (
    <FormPageWrapper width={480}>
      <ActionForm
        form={form}
        strategy={swapStrategy}
        onValuesChange={onValuesChange}
        initialValues={initialValues}
      >
        <Flex direction="col">
          <Flex direction="row" align="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>{t`swap.title`}</Typography.Title>
            </Flex.Item>
            <TransactionSettings />
          </Flex>
          <Flex.Item marginBottom={6} marginTop={-1}>
            <Typography.Footnote>{t`swap.subtitle`}</Typography.Footnote>
          </Flex.Item>
          <Flex.Item marginBottom={1}>
            <TokenControlFormItem
              assets={fromAssets}
              name="from"
              label={t`swap.fromLabel`}
              maxButton
            />
          </Flex.Item>
          <Flex.Item className="swap-button">
            <Button onClick={swapTokens} icon={<SwapOutlined />} size="large" />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <TokenControlFormItem
              assets={toAssets}
              name="to"
              label={t`swap.toLabel`}
            />
          </Flex.Item>
          <Flex.Item
            marginBottom={4}
            display={
              !!pools?.length &&
              form.getFieldsValue()?.from?.amount?.value &&
              form.getFieldsValue()?.to?.amount?.value
                ? 'block'
                : 'none'
            }
          >
            <Flex>
              <Flex.Item marginRight={1}>
                <SwapTooltip form={form} />
              </Flex.Item>
              <Flex.Item flex={1}>
                <Ratio form={form} />
              </Flex.Item>
              <Flex>
                <Form.Item name="pool" style={{ marginBottom: 0 }} />
              </Flex>
            </Flex>
          </Flex.Item>
        </Flex>
      </ActionForm>
    </FormPageWrapper>
  );
};
