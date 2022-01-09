/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain,react-hooks/exhaustive-deps */
import './AddLiquidity.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Skeleton } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
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
import { Flex, Typography } from '../../../ergodex-cdk';
import { Form, useForm } from '../../../ergodex-cdk/components/Form/NewForm';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../../hooks/useObservable';
import { assets$, getAvailableAssetFor } from '../../../services/new/assets';
import { useWalletBalance } from '../../../services/new/balance';
import { useNetworkAsset, useTotalFees } from '../../../services/new/core';
import { getPoolById, getPoolByPair } from '../../../services/new/pools';
import { AddLiquidityConfirmationModal } from './AddLiquidityConfirmationModal/AddLiquidityConfirmationModal';
import { AddLiquidityFormModel } from './FormModel';

const getAssetsByToken = (tokenId?: string) => {
  return tokenId ? getAvailableAssetFor(tokenId) : of([]);
};

const getAvailablePools = (xId?: string, yId?: string) =>
  xId && yId ? getPoolByPair(xId, yId) : of([]);

const AddLiquidity = (): JSX.Element => {
  const [balance] = useWalletBalance();
  const totalFees = useTotalFees();
  const networkAsset = useNetworkAsset();
  const { poolId } = useParams<{ poolId?: PoolId }>();
  const form = useForm<AddLiquidityFormModel>({
    x: undefined,
    y: undefined,
    pool: undefined,
    xAmount: undefined,
    yAmount: undefined,
  });
  const [pools, updatePools, poolsLoading] = useSubject(getAvailablePools);
  const [isPairSelected] = useObservable(
    combineLatest([
      form.controls.x.valueChangesWithSystem$,
      form.controls.y.valueChangesWithSystem$,
    ]).pipe(
      debounceTime(100),
      map(([x, y]) => !!x && !!y),
    ),
  );

  useEffect(() => {
    if (!poolId) {
      form.patchValue({ x: networkAsset });
    }
  }, [networkAsset]);

  const updateYAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateYAssets$.pipe(switchMap(getAssetsByToken)),
    [],
  );

  useSubscription(form.controls.x.valueChanges$, () =>
    form.patchValue({
      y: undefined,
      pool: undefined,
      yAmount: undefined,
      xAmount: undefined,
    }),
  );

  useSubscription(
    combineLatest([
      form.controls.x.valueChangesWithSystem$,
      form.controls.y.valueChangesWithSystem$.pipe(skip(1)),
    ]).pipe(debounceTime(100)),
    ([x, y]) => {
      updatePools(x?.id, y?.id);
    },
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
      form.controls.xAmount.valueChanges$.pipe(skip(1)),
      form.controls.pool.valueChanges$,
    ]).pipe(debounceTime(100)),
    ([amount]) =>
      form.controls.yAmount.patchValue(
        amount ? form.value.pool!.calculateDepositAmount(amount) : undefined,
        { emitEvent: 'silent' },
      ),
  );

  useSubscription(
    form.controls.yAmount.valueChanges$.pipe(skip(1)),
    (amount) => {
      form.controls.xAmount.patchValue(
        amount ? form.value.pool!.calculateDepositAmount(amount) : undefined,
        { emitEvent: 'system' },
      );
    },
    [],
  );

  useSubscription(
    form.controls.x.valueChangesWithSilent$,
    (token: AssetInfo | undefined) => updateYAssets$.next(token?.id),
  );

  const getInsufficientTokenNameForFee = ({
    xAmount,
  }: Required<AddLiquidityFormModel>): string | undefined => {
    const totalFeesWithAmount = xAmount.isAssetEquals(networkAsset)
      ? xAmount.plus(totalFees)
      : totalFees;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? networkAsset.name
      : undefined;
  };

  const getInsufficientTokenNameForTx = ({
    xAmount,
    yAmount,
  }: Required<AddLiquidityFormModel>): string | undefined => {
    if (xAmount.gt(balance.get(xAmount.asset))) {
      return xAmount.asset.name;
    }

    if (yAmount.gt(balance.get(yAmount.asset))) {
      return yAmount.asset.name;
    }

    return undefined;
  };

  const isAmountNotEntered = (value: AddLiquidityFormModel): boolean => {
    return !value.xAmount?.isPositive() || !value.yAmount?.isPositive();
  };

  const isTokensNotSelected = (value: AddLiquidityFormModel): boolean => {
    return !value.pool;
  };

  const addLiquidityAction = (value: Required<AddLiquidityFormModel>) => {
    openConfirmationModal(
      (next) => {
        return <AddLiquidityConfirmationModal value={value} onClose={next} />;
      },
      Operation.ADD_LIQUIDITY,
      value.xAmount!,
      value.yAmount!,
    );
  };

  return (
    <FormPageWrapper
      title="Add liquidity"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {!poolId || !poolsLoading ? (
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
                  <TokeSelectFormItem name="x" assets$={assets$} />
                </Flex.Item>
                <Flex.Item style={{ width: '100%' }}>
                  <TokeSelectFormItem name="y" assets$={yAssets$} />
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item
              marginBottom={4}
              style={{ opacity: isPairSelected ? '' : '0.3' }}
            >
              <Typography.Body strong>Select Pool</Typography.Body>
              <Form.Item name="pool">
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
                    assets$={assets$}
                  />
                </Flex.Item>
                <Flex.Item>
                  <TokenControlFormItem
                    readonly="asset"
                    disabled={!isPairSelected}
                    amountName="yAmount"
                    tokenName="y"
                    assets$={yAssets$}
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
