import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC, useMemo, useState } from 'react';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { getAmmPoolsByAssetPair } from '../../api/ammPools';
import { assetBalance$ } from '../../api/assetBalance';
import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { TokeSelectFormItem } from '../../components/common/TokenControl/TokenSelect/TokenSelect';
import { Page } from '../../components/Page/Page';
import { Section } from '../../components/Section/Section';
import { Flex, Form, useForm } from '../../ergodex-cdk';
import { AddLiquidity } from './AddLiquidity/AddLiquidity';
import { CreatePool } from './CreatePool/CreatePool';

interface AssetFormModel {
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
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
  const [componentState, setComponentState] = useState<ComponentState>(
    ComponentState.ADD_LIQUIDITY,
  );
  const form = useForm<AssetFormModel>({
    x: undefined,
    y: undefined,
  });

  const updateYAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateYAssets$.pipe(switchMap(getYAssets)),
    [],
  );

  const [pools] = useObservable(
    combineLatest([
      form.controls.x.valueChangesWithSilent$.pipe(distinctUntilChanged()),
      form.controls.y.valueChangesWithSilent$.pipe(distinctUntilChanged()),
    ]).pipe(switchMap(([x, y]) => getAvailablePools(x?.id, y?.id))),
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

  return (
    <Page title="Create pool" width={510} withBackButton>
      <Form form={form} onSubmit={() => {}}>
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
          {pools?.length || !form.value.y || !form.value.x ? (
            <AddLiquidity />
          ) : (
            <Form.Listener>
              {({ value }) => <CreatePool xAsset={value.x} yAsset={value.y} />}
            </Form.Listener>
          )}
        </Flex>
      </Form>
    </Page>
  );
};
