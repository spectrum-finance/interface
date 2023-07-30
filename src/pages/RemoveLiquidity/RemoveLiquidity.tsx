import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Form, FormGroup, Skeleton, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { first, skip } from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { Position } from '../../common/models/Position';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../components/common/FormView/FormSlider/FormSlider';
import { IsErgo } from '../../components/IsErgo/IsErgo';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { fireOperationAnalyticsEvent } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { redeem } from '../../gateway/api/operations/redeem';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { operationsSettings$ } from '../../gateway/widgets/operationsSettings';
import { useGuardV2 } from '../../hooks/useGuard';
import { mapToRedeemAnalyticsProps } from '../../utils/analytics/mapper';
import { RemoveLiquidityFormModel } from './RemoveLiquidityFormModel';

export const RemoveLiquidity: FC = () => {
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const navigate = useNavigate();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));
  const [OperationSettings] = useObservable(operationsSettings$);
  const form = useForm<RemoveLiquidityFormModel>({
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
        { replace: true },
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
    { value }: FormGroup<RemoveLiquidityFormModel>,
    poolData: Position,
  ) => {
    const xAmount = value.xAmount || poolData.availableX;
    const yAmount = value.yAmount || poolData.availableY;
    const lpAmount = value.lpAmount || poolData.availableLp;
    const percent = value.percent;

    redeem(poolData.pool, { xAmount, yAmount, lpAmount, percent })
      .pipe(first())
      .subscribe();
    fireOperationAnalyticsEvent('Redeem Form Submit', (ctx) =>
      mapToRedeemAnalyticsProps(value, poolData.pool, ctx),
    );
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
