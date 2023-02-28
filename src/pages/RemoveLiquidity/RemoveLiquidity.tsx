import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Form, FormGroup, Skeleton, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { first, skip } from 'rxjs';

// import { panalytics } from '../../common/analytics';
import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { Currency } from '../../common/models/Currency';
import { Position } from '../../common/models/Position';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../components/common/FormView/FormSlider/FormSlider';
import { IsErgo } from '../../components/IsErgo/IsErgo';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { redeem } from '../../gateway/api/operations/redeem';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { operationsSettings$ } from '../../gateway/widgets/operationsSettings';
import { useGuardV2 } from '../../hooks/useGuard';

export interface RemoveFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}

export const RemoveLiquidity: FC = () => {
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const navigate = useNavigate();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));
  const [OperationSettings] = useObservable(operationsSettings$);
  const form = useForm<RemoveFormModel>({
    percent: 100,
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
  });

  useGuardV2(
    () => !loading && !position?.availableLp?.isPositive(),
    () =>
      navigate(
        `../../../liquidity${position?.pool.id ? `/${position.pool.id}` : ''}`,
      ),
  );
  const [formValue] = useObservable(form.valueChangesWithSilent$);

  useSubscription(
    form.controls.percent.valueChanges$.pipe(skip(1)),
    (percent) => {
      form.patchValue({
        xAmount:
          percent === 100
            ? position?.availableX
            : position?.availableX.percent(percent),
        yAmount:
          percent === 100
            ? position?.availableY
            : position?.availableY.percent(percent),
        lpAmount:
          percent === 100
            ? position?.availableLp
            : position?.availableLp.percent(percent),
      });
    },
    [position],
  );

  const handleRemove = (
    form: FormGroup<RemoveFormModel>,
    poolData: Position,
  ) => {
    const xAmount = form.value.xAmount || poolData.availableX;
    const yAmount = form.value.yAmount || poolData.availableY;
    const lpAmount = form.value.lpAmount || poolData.availableLp;
    const percent = form.value.percent;

    redeem(poolData.pool, { xAmount, yAmount, lpAmount, percent })
      .pipe(first())
      .subscribe();
    // panalytics.submitRedeem(
    //   { xAmount, yAmount, lpAmount, percent },
    //   poolData.pool,
    // );
  };

  return (
    <Page maxWidth={382} title={t`Remove liquidity`} withBackButton>
      {position ? (
        <Form form={form} onSubmit={(form) => handleRemove(form, position)}>
          <Flex direction="col">
            <Flex.Item marginBottom={2} display="flex" justify="space-between">
              <PageHeader position={position} />
              <IsErgo>
                {OperationSettings && (
                  <OperationSettings hideNitro hideSlippage />
                )}
              </IsErgo>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PageSection boxed={false} title={t`Amount`} noPadding>
                <Form.Item name="percent">
                  {({ value, onChange }) => (
                    <FormSlider value={value} onChange={onChange} />
                  )}
                </Form.Item>
              </PageSection>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormPairSection
                glass
                title={t`Assets to remove`}
                xAmount={formValue?.xAmount || position.availableX}
                yAmount={formValue?.yAmount || position.availableY}
              />
            </Flex.Item>

            {/*TODO: ADD_FEES_DISPLAY_AFTER_SDK_UPDATE[EDEX-468]*/}
            {/*<Flex.Item marginBottom={4}>*/}
            {/*  <TokenSpace title="Earned Fees" pair={pair} fees />*/}
            {/*</Flex.Item>*/}

            <Flex.Item>
              <SubmitButton
                disabled={
                  !formValue?.percent || !position.availableLp.isPositive()
                }
                htmlType="submit"
              >
                <Trans>Remove</Trans>
              </SubmitButton>
            </Flex.Item>
          </Flex>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
