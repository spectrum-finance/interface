import { Flex, FormGroup } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { ElementName } from '@spectrumlabs/analytics';
import { TraceProps } from '@spectrumlabs/analytics/lib/esm/types';
import maxBy from 'lodash/maxBy';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  Observable,
  of,
  skip,
  switchMap,
} from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { fireOperationAnalyticsEvent } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { ammPools$, getAmmPoolsByAssetPair } from '../../gateway/api/ammPools';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import {
  defaultTokenAssets$,
  getAssetToImportFor,
  getDefaultAssetsFor,
  getImportedAssetsFor,
  importedTokenAssets$,
  tokenAssetsToImport$,
} from '../../gateway/api/assets';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { deposit } from '../../gateway/api/operations/deposit';
import { useHandleDepositMaxButtonClick } from '../../gateway/api/useHandleDepositMaxButtonClick';
import { useDepositValidators } from '../../gateway/api/validationFees';
import { mapToDepositAnalyticsProps } from '../../utils/analytics/mapper';
import { AssetControlFormItem } from '../common/TokenControl/AssetControl';
import {
  OperationForm,
  OperationValidator,
} from '../OperationForm/OperationForm';
import { Section } from '../Section/Section';
import { AddLiquidityFormModel } from './AddLiquidityFormModel';
import { LiquidityPercentInput } from './LiquidityPercentInput/LiquidityPercentInput';

export interface AddLiquidityFormProps {
  readonly initialPoolId?: string;
  readonly initialPoolNotFound?: () => void;
  readonly poolChanged?: (pool: AmmPool | undefined) => void;
  readonly form: FormGroup<AddLiquidityFormModel>;
  readonly traceFormLocation: TraceProps['element_location'];
  readonly children?: ReactNode[] | ReactNode | string;
  readonly onSubmitSuccess?: () => void;
}

const getYAssets = (fromAsset?: string) =>
  fromAsset ? getDefaultAssetsFor(fromAsset) : defaultTokenAssets$;

const getYAssetsToImport = (fromAsset?: string) =>
  fromAsset ? getAssetToImportFor(fromAsset) : tokenAssetsToImport$;

const getYImportedAssets = (fromAsset?: string) =>
  fromAsset ? getImportedAssetsFor(fromAsset) : importedTokenAssets$;

const isAssetsPairEquals = (
  [prevFrom, prevTo]: [AssetInfo | undefined, AssetInfo | undefined],
  [nextFrom, nextTo]: [AssetInfo | undefined, AssetInfo | undefined],
) =>
  (prevFrom?.id === nextFrom?.id && prevTo?.id === nextTo?.id) ||
  (prevFrom?.id === nextTo?.id && prevTo?.id === nextFrom?.id);

const getAvailablePools = (xId?: string, yId?: string): Observable<AmmPool[]> =>
  xId && yId ? getAmmPoolsByAssetPair(xId, yId) : of([]);

export const AddLiquidityForm: FC<AddLiquidityFormProps> = ({
  form,
  initialPoolId,
  initialPoolNotFound,
  poolChanged,
  children,
  traceFormLocation,
  onSubmitSuccess,
}) => {
  const [lastEditedField, setLastEditedField] = useState<'x' | 'y'>('x');
  const [balance] = useAssetsBalance();
  const [networkAsset] = useNetworkAsset();
  const _handleDepositMaxButtonClick = useHandleDepositMaxButtonClick();
  const depositValidators = useDepositValidators();
  const [allAmmPools, allAmmPoolsLoading] = useObservable(ammPools$);

  const updateToAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getYAssets)),
    [],
  );
  const yAssetsToImport$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getYAssetsToImport)),
    [],
  );
  const yImportedAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getYImportedAssets)),
    [],
  );

  useEffect(() => {
    if (!!form.value.xAsset || !!form.value.yAsset || !allAmmPools) {
      return;
    }
    if (!initialPoolId) {
      form.patchValue({ xAsset: networkAsset });
      return;
    }
    const pool: AmmPool | undefined = allAmmPools.find(
      (ammPool) => ammPool.id === initialPoolId,
    );

    if (pool) {
      form.patchValue({
        xAsset: pool.x.asset,
        yAsset: pool.y.asset,
      });
    } else {
      form.patchValue({ xAsset: networkAsset });
      if (initialPoolNotFound) {
        initialPoolNotFound();
      }
    }
  }, [allAmmPools, initialPoolId]);

  useSubscription(form.controls.xAsset.valueChangesWithSilent$, (token) =>
    updateToAssets$.next(token?.id),
  );

  useSubscription(
    combineLatest([
      form.controls.xAsset.valueChangesWithSilent$.pipe(distinctUntilChanged()),
      form.controls.yAsset.valueChangesWithSilent$.pipe(distinctUntilChanged()),
    ]).pipe(
      debounceTime(100),
      distinctUntilChanged(isAssetsPairEquals),
      switchMap(([xAsset, yAsset]) =>
        getAvailablePools(xAsset?.id, yAsset?.id),
      ),
    ),
    (pools) => {
      if (!pools.length && form.value.xAsset && form.value.yAsset) {
        form.patchValue(
          {
            pool: undefined,
            yAsset: undefined,
            x: lastEditedField === 'x' ? form.value.x : undefined,
            y: lastEditedField === 'y' ? form.value.y : undefined,
          },
          { emitEvent: 'silent' },
        );
        if (poolChanged) {
          poolChanged(undefined);
        }
        return;
      }

      const newPool: AmmPool | undefined =
        pools.find((p) => p.id === form.value.pool?.id) ||
        maxBy(pools, (p) => p.x.amount * p.y.amount);

      if (
        !form.value.pool?.x.isEquals(newPool?.x) ||
        !form.value.pool?.y.isEquals(newPool?.y)
      ) {
        form.patchValue({ pool: newPool });
        if (poolChanged && !allAmmPoolsLoading) {
          poolChanged(newPool);
        }
      }
    },
    [lastEditedField],
  );

  useSubscription(form.controls.x.valueChanges$.pipe(skip(1)), (value) => {
    setLastEditedField('x');

    if (form.value.pool && value) {
      form.controls.y.patchValue(
        form.value.pool.calculateDepositAmount(value),
        { emitEvent: 'silent' },
      );
    } else {
      form.controls.y.patchValue(undefined, { emitEvent: 'silent' });
    }
  });

  useSubscription(form.controls.y.valueChanges$.pipe(skip(1)), (value) => {
    setLastEditedField('y');

    if (form.value.pool && value) {
      form.controls.x.patchValue(
        form.value.pool.calculateDepositAmount(value),
        { emitEvent: 'silent' },
      );
    } else {
      form.controls.x.patchValue(undefined, { emitEvent: 'silent' });
    }
  });

  useSubscription(
    form.controls.pool.valueChanges$,
    () => {
      const { x, y, pool } = form.value;

      if (!pool) {
        return;
      }

      if (lastEditedField === 'x' && x && x.isPositive()) {
        form.controls.y.patchValue(pool.calculateDepositAmount(x), {
          emitEvent: 'silent',
        });
      }

      if (lastEditedField === 'y' && y && y.isPositive()) {
        form.controls.x.patchValue(pool.calculateDepositAmount(y), {
          emitEvent: 'silent',
        });
      }
    },
    [lastEditedField],
  );

  const resetForm = () =>
    form.patchValue(
      {
        x: undefined,
        y: undefined,
      },
      { emitEvent: 'silent' },
    );

  const addLiquidityAction = ({ value }: FormGroup<AddLiquidityFormModel>) => {
    deposit(value as Required<AddLiquidityFormModel>)
      .pipe(first())
      .subscribe(() => {
        resetForm();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      });
    fireOperationAnalyticsEvent('Deposit Form Submit', (ctx) =>
      mapToDepositAnalyticsProps(value, ctx),
    );
  };

  const handleMaxLiquidityClick = (pct: number) => {
    const { xAsset, yAsset, pool } = form.value;

    if (!xAsset || !yAsset || !pool) {
      return;
    }
    const [newX, newY] = _handleDepositMaxButtonClick(pct, form.value, balance);
    form.patchValue(
      {
        x: newX,
        y: newY,
      },
      { emitEvent: 'silent' },
    );
  };

  const balanceValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { x, y },
  }) => {
    if (x?.gt(balance.get(x?.asset))) {
      return t`Insufficient ${x?.asset.ticker} Balance`;
    }

    if (y?.gt(balance.get(y?.asset))) {
      return t`Insufficient ${y?.asset.ticker} Balance`;
    }

    return undefined;
  };

  const amountValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { x, y },
  }) => {
    if (
      (!x?.isPositive() && y?.isPositive()) ||
      (!y?.isPositive() && x?.isPositive())
    ) {
      return undefined;
    }

    return (!x?.isPositive() || !y?.isPositive()) && t`Enter an Amount`;
  };

  const minValueValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { xAsset, yAsset, x, y, pool },
  }) => {
    let c: Currency | undefined;
    if (!x?.isPositive() && y?.isPositive() && pool) {
      c = pool.calculateDepositAmount(new Currency(1n, xAsset)).plus(1n);
    }
    if (!y?.isPositive() && x?.isPositive() && pool) {
      c = pool.calculateDepositAmount(new Currency(1n, yAsset));
    }
    return c && t`Min value for ${c?.asset.ticker} is ${c?.toString()}`;
  };

  const selectTokenValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { pool },
  }) => !pool && t`Select a token`;

  const validators: OperationValidator<AddLiquidityFormModel>[] = useMemo(
    () => [
      selectTokenValidator,
      amountValidator,
      minValueValidator,
      balanceValidator,
      ...depositValidators,
    ],
    [balance],
  );

  return (
    <OperationForm
      form={form}
      onSubmit={addLiquidityAction}
      validators={validators}
      actionCaption={t`Add Liquidity`}
      traceFormLocation={traceFormLocation}
    >
      <Section
        gap={2}
        title={t`Liquidity`}
        extra={
          <Flex justify="flex-end">
            <LiquidityPercentInput onClick={handleMaxLiquidityClick} />
          </Flex>
        }
      >
        <Flex col>
          <Flex.Item marginBottom={2}>
            <AssetControlFormItem
              assets$={defaultTokenAssets$}
              assetsToImport$={tokenAssetsToImport$}
              importedAssets$={importedTokenAssets$}
              loading={allAmmPoolsLoading}
              trace={{
                element_location: traceFormLocation,
                element_name: ElementName.tokenX,
              }}
              amountName="x"
              tokenName="xAsset"
            />
          </Flex.Item>
          <Flex.Item>
            <AssetControlFormItem
              assets$={yAssets$}
              assetsToImport$={yAssetsToImport$}
              importedAssets$={yImportedAssets$}
              loading={allAmmPoolsLoading}
              trace={{
                element_location: traceFormLocation,
                element_name: ElementName.tokenY,
              }}
              amountName="y"
              tokenName="yAsset"
            />
          </Flex.Item>
        </Flex>
      </Section>
      {children}
    </OperationForm>
  );
};
