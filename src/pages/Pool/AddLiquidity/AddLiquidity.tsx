/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain,react-hooks/exhaustive-deps */
import './AddLiquidity.less';

import { AmmPool, PoolId } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Skeleton } from 'antd';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import {
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  of,
  skip,
  switchMap,
} from 'rxjs';

import { ActionForm } from '../../../components/common/ActionForm/ActionForm';
import { PoolSelect } from '../../../components/common/PoolSelect/PoolSelect';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { TokeSelectFormItem } from '../../../components/common/TokenControl/TokenSelect/TokenSelect';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import {
  ERG_DECIMALS,
  ERG_TOKEN_ID,
  ERG_TOKEN_NAME,
  UI_FEE,
} from '../../../constants/erg';
import { defaultExFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import { Flex, Typography } from '../../../ergodex-cdk';
import { Form, useForm } from '../../../ergodex-cdk/components/Form/NewForm';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../../hooks/useObservable';
import { assets$, getAvailableAssetFor } from '../../../services/new/assets';
import { useWalletBalance } from '../../../services/new/balance';
import { getPoolById, getPoolByPair } from '../../../services/new/pools';
import {
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';
import { calculateTotalFee } from '../../../utils/transactions';
import { AddLiquidityConfirmationModal } from './AddLiquidityConfirmationModal/AddLiquidityConfirmationModal';
import { AddLiquidityFormModel } from './FormModel';

const getAssetsByToken = (tokenId?: string) => {
  return tokenId ? getAvailableAssetFor(tokenId) : of([]);
};

const getAvailablePools = (xId?: string, yId?: string) =>
  xId && yId ? getPoolByPair(xId, yId) : of([]);

const AddLiquidity = (): JSX.Element => {
  const [balance] = useWalletBalance();
  const [{ minerFee }] = useSettings();
  const { poolId } = useParams<{ poolId?: PoolId }>();
  const form = useForm<AddLiquidityFormModel>({
    x: {
      name: 'ERG',
      id: '0000000000000000000000000000000000000000000000000000000000000000',
      decimals: ERG_DECIMALS,
    },
    y: undefined,
    activePool: undefined,
    xAmount: undefined,
    yAmount: undefined,
  });
  const [xAssets] = useObservable(assets$);
  const [yAssets, updateYAssets] = useSubject(getAssetsByToken);
  const [pools, updatePools] = useSubject(getAvailablePools);
  const [isPairSelected] = useObservable(
    combineLatest([
      form.controls.x.valueChangesWithSystem$,
      form.controls.y.valueChangesWithSystem$,
    ]).pipe(
      debounceTime(100),
      map(([x, y]) => !!x && !!y),
    ),
  );

  const getInsufficientTokenNameForFee = useCallback(
    (value: AddLiquidityFormModel): string | undefined => {
      const { xAmount, x } = value;

      let totalFees = +calculateTotalFee(
        [minerFee, UI_FEE, defaultExFee],
        ERG_DECIMALS,
      );

      totalFees =
        x?.id === ERG_TOKEN_ID ? totalFees + xAmount?.value! : totalFees;

      return +totalFees > balance.get(ERG_TOKEN_ID)
        ? ERG_TOKEN_NAME
        : undefined;
    },
    [balance, minerFee],
  );

  const getInsufficientTokenNameForTx = useCallback(
    (value: AddLiquidityFormModel): string | undefined => {
      const { x, y, xAmount, yAmount } = value;
      const xAmountValue = xAmount?.value;
      const yAmountValue = yAmount?.value;

      if (x && xAmount && xAmountValue! > balance.get(x?.id)) {
        return x?.name;
      }

      if (y && yAmount && yAmountValue! > balance.get(y?.id)) {
        return y?.name;
      }

      return undefined;
    },
    [balance],
  );

  const isAmountNotEntered = useCallback(
    (value: AddLiquidityFormModel): boolean => {
      return !value.xAmount?.value || !value.yAmount?.value;
    },
    [],
  );

  const isTokensNotSelected = useCallback(
    (value: AddLiquidityFormModel): boolean => {
      return !value.activePool;
    },
    [],
  );

  const addLiquidityAction = useCallback((value: AddLiquidityFormModel) => {
    openConfirmationModal(
      (next) => {
        return (
          <AddLiquidityConfirmationModal
            position={value.activePool}
            pair={{
              assetX: {
                name: value.x?.name,
                amount: value.xAmount?.value,
              },
              assetY: {
                name: value.y?.name,
                amount: value.yAmount?.value,
              },
            }}
            onClose={next}
          />
        );
      },
      Operation.ADD_LIQUIDITY,
      { asset: value.x!, amount: value?.xAmount?.value! },
      { asset: value.y!, amount: value?.yAmount?.value! },
    );
  }, []);

  useSubscription(
    form.controls.x.valueChanges$,
    (token: AssetInfo | undefined) => updateYAssets(token?.id),
  );

  useSubscription(
    of(poolId).pipe(
      filter(Boolean),
      switchMap((poolId) => getPoolById(poolId)),
    ),
    (pool) => {
      form.patchValue(
        {
          x: pool?.x.asset,
          y: pool?.y.asset,
        },
        { emitEvent: 'system' },
      );
    },
  );

  useSubscription(
    combineLatest([
      form.controls.x.valueChangesWithSystem$,
      form.controls.y.valueChangesWithSystem$,
    ]).pipe(debounceTime(100)),
    ([x, y]) => {
      updatePools(x?.id, y?.id);
    },
  );

  useSubscription(form.controls.x.valueChanges$, () =>
    form.patchValue({ y: undefined, activePool: undefined }),
  );

  useSubscription(
    combineLatest([
      form.controls.xAmount.valueChanges$.pipe(skip(1)),
      form.controls.activePool.valueChanges$,
    ]),
    ([amount]) => {
      const newYAmount = form.value.activePool!.depositAmount(
        new AssetAmount(
          form.value.x!,
          parseUserInputToFractions(amount?.value ?? 0, form.value.x!.decimals),
        ),
      );

      const value = Number(
        renderFractions(newYAmount.amount, newYAmount.asset.decimals),
      );

      form.controls.yAmount.patchValue(
        {
          value,
          viewValue: value.toString(),
        },
        { emitEvent: 'system' },
      );
    },
  );

  useSubscription(
    form.controls.yAmount.valueChanges$.pipe(skip(1)),
    (amount) => {
      const newXAmount = form.value.activePool!.depositAmount(
        new AssetAmount(
          form.value.y!,
          parseUserInputToFractions(amount?.value ?? 0, form.value.y!.decimals),
        ),
      );

      const value = Number(
        renderFractions(newXAmount.amount, newXAmount.asset.decimals),
      );

      form.controls.xAmount.patchValue(
        {
          value,
          viewValue: value.toString(),
        },
        { emitEvent: 'system' },
      );
    },
  );

  return (
    <FormPageWrapper
      title="Add liquidity"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {!poolId || (pools && pools.length) ? (
        <ActionForm
          form={form}
          actionButton="Add liquidity"
          getInsufficientTokenNameForFee={getInsufficientTokenNameForFee}
          getInsufficientTokenNameForTx={getInsufficientTokenNameForTx}
          isAmountNotEntered={isAmountNotEntered}
          isTokensNotSelected={isTokensNotSelected}
          action={addLiquidityAction}
        >
          <Flex direction="col">
            <Flex.Item marginBottom={4}>
              <Typography.Body strong>Select Pair</Typography.Body>
              <Flex justify="center" align="center">
                <Flex.Item marginRight={2} style={{ width: '100%' }}>
                  <TokeSelectFormItem name="x" assets={xAssets} />
                </Flex.Item>
                <Flex.Item style={{ width: '100%' }}>
                  <TokeSelectFormItem name="y" assets={yAssets} />
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item
              marginBottom={4}
              style={{ opacity: isPairSelected ? '' : '0.3' }}
            >
              <Typography.Body strong>Select Pool</Typography.Body>
              <Form.Item name="activePool">
                {({ value, onChange }) => (
                  <PoolSelect
                    positions={pools}
                    value={value}
                    onChange={onChange}
                  />
                )}
              </Form.Item>
            </Flex.Item>
            <Flex.Item
              marginBottom={4}
              style={{ opacity: isPairSelected ? '' : '0.3' }}
            >
              <Typography.Body strong>Liquidity</Typography.Body>
              <Flex direction="col">
                <Flex.Item marginBottom={2}>
                  <TokenControlFormItem
                    readonly="asset"
                    disabled={!isPairSelected}
                    amountName="xAmount"
                    tokenName="x"
                    assets={xAssets}
                  />
                </Flex.Item>
                <Flex.Item>
                  <TokenControlFormItem
                    readonly="asset"
                    disabled={!isPairSelected}
                    amountName="yAmount"
                    tokenName="y"
                    assets={yAssets}
                  />
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </ActionForm>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};
export { AddLiquidity };
