// TODO: REPLACE_ANTD_SKELETON_COMPONENT[EDEX-467]
import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { combineLatest, debounceTime, map, Observable, of, skip } from 'rxjs';

import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TokenIconPair } from '../../components/TokenIconPair/TokenIconPair';
import { Flex, Skeleton, Typography } from '../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../ergodex-cdk/components/Form/NewForm';
import { lpWalletBalance$ } from '../../services/new/balance';
import { getPoolById } from '../../services/new/pools';
import { ConfirmRemoveModal } from './ConfirmRemoveModal/ConfirmRemoveModal';
import { PairSpace } from './PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from './RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';
import { RemovePositionSlider } from './RemovePositionSlider/RemovePositionSlider';

interface PoolData {
  readonly pool: AmmPool;
  readonly lpBalance: Currency;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
}

interface RemoveFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
}

const getPoolDataById = (poolId: PoolId): Observable<PoolData | undefined> =>
  !poolId
    ? of(undefined)
    : combineLatest([getPoolById(poolId), lpWalletBalance$]).pipe(
        map(([pool, balance]) => {
          if (!pool) {
            return undefined;
          }
          const lpBalance = balance.get(pool.lp.asset);
          const [xAmount, assetY] = pool.shares(lpBalance);

          return { pool, lpBalance, xAmount: xAmount, yAmount: assetY };
        }),
      );

export const Remove: FC = () => {
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [poolData, updatePoolData] = useSubject(getPoolDataById);
  const form = useForm<RemoveFormModel>({
    percent: 100,
    xAmount: undefined,
    yAmount: undefined,
  });
  const [formValue] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
  );

  useEffect(() => updatePoolData(poolId), []);

  useSubscription(
    form.controls.percent.valueChanges$.pipe(skip(1)),
    (percent) => {
      form.patchValue({
        xAmount:
          percent === 100
            ? poolData?.xAmount
            : poolData?.xAmount.percent(percent),
        yAmount:
          percent === 100
            ? poolData?.yAmount
            : poolData?.yAmount.percent(percent),
      });
    },
    [poolData],
  );

  const handleRemove = (
    form: FormGroup<RemoveFormModel>,
    poolData: PoolData,
  ) => {
    const xAmount = form.value.xAmount || poolData.xAmount;
    const yAmount = form.value.yAmount || poolData.yAmount;

    openConfirmationModal(
      (next) => {
        return (
          <ConfirmRemoveModal
            onClose={next}
            xAmount={xAmount}
            yAmount={yAmount}
            pool={poolData.pool}
            lpToRemove={poolData.lpBalance}
          />
        );
      },
      Operation.REMOVE_LIQUIDITY,
      xAmount,
      yAmount,
    );
  };

  return (
    <FormPageWrapper width={382} title="Remove liquidity" withBackButton>
      {poolData ? (
        <Form form={form} onSubmit={(form) => handleRemove(form, poolData)}>
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <Flex.Item>
                <Flex align="center">
                  <Flex.Item display="flex" marginRight={2}>
                    <TokenIconPair
                      tokenPair={{
                        tokenA: poolData.xAmount.asset.name,
                        tokenB: poolData.yAmount.asset.name,
                      }}
                    />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Title level={4}>
                      {poolData?.xAmount.asset.name} /{' '}
                      {poolData?.yAmount.asset.name}
                    </Typography.Title>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <RemoveFormSpaceWrapper title="Amount">
                <Form.Item name="percent">
                  {({ value, onChange }) => (
                    <RemovePositionSlider value={value} onChange={onChange} />
                  )}
                </Form.Item>
              </RemoveFormSpaceWrapper>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PairSpace
                title="Pooled Assets"
                xAmount={formValue?.xAmount || poolData.xAmount}
                yAmount={formValue?.yAmount || poolData.yAmount}
              />
            </Flex.Item>

            {/*TODO: ADD_FEES_DISPLAY_AFTER_SDK_UPDATE[EDEX-468]*/}
            {/*<Flex.Item marginBottom={4}>*/}
            {/*  <TokenSpace title="Earned Fees" pair={pair} fees />*/}
            {/*</Flex.Item>*/}

            <Flex.Item>
              <SubmitButton disabled={!formValue?.percent} htmlType="submit">
                Remove
              </SubmitButton>
            </Flex.Item>
          </Flex>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};
