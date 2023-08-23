import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Form, Skeleton, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
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

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetSelectFormItem } from '../../components/common/TokenControl/AssetSelect/AssetSelect';
import { IsErgo } from '../../components/IsErgo/IsErgo';
import { Page } from '../../components/Page/Page';
import { Section } from '../../components/Section/Section';
import {
  getAmmPoolById,
  getAmmPoolsByAssetPair,
} from '../../gateway/api/ammPools';
import { assetBalance$ } from '../../gateway/api/assetBalance';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { selectedWallet$ } from '../../gateway/api/wallets';
import { operationsSettings$ } from '../../gateway/widgets/operationsSettings';
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
  const [OperationSettings] = useObservable(operationsSettings$);
  const { poolId } = useParams<{ poolId?: PoolId }>();
  const [initialized, setInitialized] = useState<boolean>(!poolId);
  const [networkAsset] = useNetworkAsset();
  const [selectedWallet] = useObservable(selectedWallet$);
  const navigate = useNavigate();
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

  const [value] = useObservable(form.valueChangesWithSilent$);

  const updateYAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateYAssets$.pipe(switchMap(getYAssets)),
    [],
  );

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
      if (!pool) {
        navigate('../../add');
        return;
      }

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
    !!selectedWallet?.walletSupportedFeatures.createPool &&
    !!y &&
    !!x;

  return (
    <Form form={form}>
      <Page
        title={
          <Form.Listener>
            {({ value }) =>
              isAddLiquidityPageVisible(value, componentState)
                ? t`Add Liquidity`
                : t`Create Pool`
            }
          </Form.Listener>
        }
        maxWidth={510}
        withBackButton
        onBackButtonClick={handleBackButtonClick}
        backTo="../../../liquidity"
        padding={4}
      >
        {initialized ? (
          <Flex col>
            <Flex.Item marginBottom={4} display="flex" col>
              <Section
                title={t`Select Pair`}
                gap={2}
                extra={
                  <IsErgo>
                    {OperationSettings && (
                      <OperationSettings hideNitro hideSlippage />
                    )}
                  </IsErgo>
                }
              >
                <Flex justify="center" align="center">
                  <Flex.Item marginRight={2} flex={1}>
                    <AssetSelectFormItem
                      name="x"
                      assets$={xAssets$}
                      trace={{
                        element_name: ElementName.tokenX,
                        element_location:
                          value &&
                          isAddLiquidityPageVisible(value, componentState)
                            ? ElementLocation.depositForm
                            : ElementLocation.createPoolForm,
                      }}
                    />
                  </Flex.Item>
                  <Flex.Item flex={1}>
                    <AssetSelectFormItem
                      name="y"
                      assets$={yAssets$}
                      trace={{
                        element_name: ElementName.tokenY,
                        element_location:
                          value &&
                          isAddLiquidityPageVisible(value, componentState)
                            ? ElementLocation.depositForm
                            : ElementLocation.createPoolForm,
                      }}
                    />
                  </Flex.Item>
                </Flex>
              </Section>
            </Flex.Item>
            <Form.Listener>
              {({ value }) =>
                isInfoAlertVisible(value, componentState) && (
                  <Flex.Item marginBottom={4} display="flex" col>
                    <NoPoolInfoAlert>
                      <Trans>
                        The pool with such a pair has not yet been initialized.
                        To create a pool enter an initial price. Then add the
                        deposit amount.
                      </Trans>
                    </NoPoolInfoAlert>
                  </Flex.Item>
                )
              }
            </Form.Listener>
            <Form.Listener>
              {({ value }) =>
                selectedWallet?.walletSupportedFeatures.createPool === false &&
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
                      !selectedWallet?.walletSupportedFeatures.createPool)
                  }
                >
                  {isAddLiquidityPageVisible(value, componentState) ? (
                    <AddLiquidity />
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
