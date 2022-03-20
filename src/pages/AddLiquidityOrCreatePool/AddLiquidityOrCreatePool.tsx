import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { getAmmPoolById, getAmmPoolsByAssetPair } from '../../api/ammPools';
import { assetBalance$ } from '../../api/assetBalance';
import { selectedWallet$ } from '../../api/wallets';
import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { TokeSelectFormItem } from '../../components/common/TokenControl/TokenSelect/TokenSelect';
import { Page } from '../../components/Page/Page';
import { Section } from '../../components/Section/Section';
import { Flex, Form, Skeleton, useForm } from '../../ergodex-cdk';
import { useNetworkAsset } from '../../services/new/core';
import { AddLiquidity } from './AddLiquidity/AddLiquidity';
import { CreatePool } from './CreatePool/CreatePool';
import { CreatePoolUnsupportedAlert } from './CreatePoolUnsupportedAlert/CreatePoolUnsupportedAlert';
import { NoPoolInfoAlert } from './NoPoolInfoAlert/NoPoolInfoAlert';
import { Overlay } from './Overlay/Overlay';

interface AssetFormModel {
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
  readonly pools?: AmmPool[];
}

const xAssets$ = assetBalance$.pipe(
  map((balance) => balance.values().map((balance) => balance.asset)),
);

const getAvailablePools = (
  xId?: string,
  yId?: string,
): Observable<AmmPool[]> => {
  return xId && yId ? getAmmPoolsByAssetPair(xId, yId) : of([]);
};

const getYAssets = (xId?: string) =>
  xId
    ? xAssets$.pipe(map((assets) => assets.filter((a) => a.id !== xId)))
    : xAssets$;

enum ComponentState {
  ADD_LIQUIDITY,
  CREATE_POOL,
}

export const AddLiquidityOrCreatePool: FC = () => {
  const { poolId } = useParams<{ poolId?: PoolId }>();
  const [initialized, setInitialized] = useState<boolean>(!poolId);
  const networkAsset = useNetworkAsset();
  const [selectedWallet] = useObservable(selectedWallet$);
  const history = useHistory();
  const location = useLocation();
  const [componentState, setComponentState] = useState<ComponentState>(
    location.pathname.endsWith('create')
      ? ComponentState.CREATE_POOL
      : ComponentState.ADD_LIQUIDITY,
  );

  const form = useForm<AssetFormModel>({
    x: undefined,
    y: undefined,
    pools: undefined,
  });

  const updateYAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateYAssets$.pipe(switchMap(getYAssets)),
    [],
  );

  const handleNewPoolButtonClick = () => {
    history.push('/pool/create');
    setComponentState(ComponentState.CREATE_POOL);
  };

  const handleBackButtonClick = () => {
    if (ComponentState.CREATE_POOL && history.length) {
      setComponentState(ComponentState.ADD_LIQUIDITY);
    }
  };

  useEffect(() => {
    if (!poolId) {
      form.patchValue({ x: networkAsset });
    }
  }, [networkAsset]);

  useSubscription(
    of(poolId).pipe(
      filter(Boolean),
      switchMap((poolId) => getAmmPoolById(poolId)),
      distinctUntilChanged((poolA, poolB) => poolA?.id === poolB?.id),
    ),
    (pool) => {
      form.patchValue(
        {
          x: pool?.x.asset,
          y: pool?.y.asset,
        },
        { emitEvent: 'system' },
      );
      setInitialized(true);
    },
  );

  useSubscription(
    combineLatest([
      form.controls.x.valueChangesWithSilent$.pipe(distinctUntilChanged()),
      form.controls.y.valueChangesWithSilent$.pipe(distinctUntilChanged()),
    ]).pipe(switchMap(([x, y]) => getAvailablePools(x?.id, y?.id))),
    (pools) => form.patchValue({ pools }),
  );

  useSubscription(
    form.controls.x.valueChangesWithSilent$,
    (asset: AssetInfo | undefined) => updateYAssets$.next(asset?.id),
  );

  useSubscription(
    form.controls.x.valueChangesWithSilent$,
    (asset: AssetInfo | undefined) => {
      if (asset?.id === form.value.y?.id) {
        form.patchValue({ y: undefined });
      }
    },
  );

  const isAddLiquidityPageVisible = (
    { pools, x, y }: AssetFormModel,
    componentState: ComponentState,
  ): boolean =>
    (!!pools?.length || !x || !y) &&
    componentState === ComponentState.ADD_LIQUIDITY;

  const isCreatePoolPageVisible = (
    value: AssetFormModel,
    componentState: ComponentState,
  ): boolean => !isAddLiquidityPageVisible(value, componentState);

  const isInfoAlertVisible = (
    { x, y, pools }: AssetFormModel,
    componentState: ComponentState,
  ): boolean =>
    !pools?.length &&
    componentState === ComponentState.ADD_LIQUIDITY &&
    !!selectedWallet?.supportedFeatures.createPool &&
    !!y &&
    !!x;

  return (
    <Form form={form}>
      <Page
        title={
          <Form.Listener>
            {({ value }) =>
              isAddLiquidityPageVisible(value, componentState)
                ? 'Add Liquidity'
                : 'Create Pool'
            }
          </Form.Listener>
        }
        width={510}
        withBackButton
        onBackButtonClick={handleBackButtonClick}
        backTo="/pool"
      >
        {initialized ? (
          <Flex col>
            <Flex.Item marginBottom={4} display="flex" col>
              <Section title="Select Pair">
                <Flex justify="center" align="center">
                  <Flex.Item marginRight={2} flex={1}>
                    <TokeSelectFormItem name="x" assets$={xAssets$} />
                  </Flex.Item>
                  <Flex.Item flex={1}>
                    <TokeSelectFormItem name="y" assets$={yAssets$} />
                  </Flex.Item>
                </Flex>
              </Section>
            </Flex.Item>
            <Form.Listener>
              {({ value }) =>
                isInfoAlertVisible(value, componentState) && (
                  <Flex.Item marginBottom={4} display="flex" col>
                    <NoPoolInfoAlert>
                      The pool with such a pair has not yet been initialized. To
                      create a pool enter an initial price. Then add the deposit
                      amount.
                    </NoPoolInfoAlert>
                  </Flex.Item>
                )
              }
            </Form.Listener>
            <Form.Listener>
              {({ value }) =>
                selectedWallet?.supportedFeatures.createPool === false &&
                isCreatePoolPageVisible(value, componentState) && (
                  <Flex.Item marginBottom={4} display="flex" col>
                    <CreatePoolUnsupportedAlert
                      walletName={selectedWallet.name}
                    />
                  </Flex.Item>
                )
              }
            </Form.Listener>
            <Form.Listener>
              {({ value }) => (
                <Overlay
                  enabled={
                    !value.x ||
                    !value.y ||
                    (isCreatePoolPageVisible(value, componentState) &&
                      !selectedWallet?.supportedFeatures.createPool)
                  }
                >
                  {isAddLiquidityPageVisible(value, componentState) ? (
                    <AddLiquidity
                      pools={value.pools}
                      xAsset={value.x}
                      yAsset={value.y}
                      onNewPoolButtonClick={handleNewPoolButtonClick}
                    />
                  ) : (
                    <CreatePool xAsset={value.x} yAsset={value.y} />
                  )}
                </Overlay>
              )}
            </Form.Listener>
          </Flex>
        ) : (
          <Skeleton active />
        )}
      </Page>
    </Form>
  );
};
