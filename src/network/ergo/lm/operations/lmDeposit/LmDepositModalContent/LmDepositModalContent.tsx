import { Button, Flex, Form, FormGroup, useForm } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import { Observable, skip, tap } from 'rxjs';

import { useSubscription } from '../../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../../common/models/Currency';
import { Farm } from '../../../../../../common/models/Farm';
import { TxId } from '../../../../../../common/types';
import { FormPairSection } from '../../../../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../../../../../components/common/FormView/FormSlider/FormSlider';
import { PageSection } from '../../../../../../components/Page/PageSection/PageSection';
import { fireOperationAnalyticsEvent } from '../../../../../../gateway/analytics/fireOperationAnalyticsEvent.ts';
import { mapToStakeAnalyticsProps } from '../../../../../../utils/analytics/mapper.ts';
import { walletLmDeposit } from '../walletLmDeposit';

export interface LmDepositModalContentProps {
  readonly farm: Farm;
  readonly onClose: (p: Observable<TxId>, value: StakeFormModel) => void;
}

export interface StakeFormModel {
  readonly percent: number;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
  readonly lpAmount: Currency;
}

export const LmDepositModalContent: FC<LmDepositModalContentProps> = ({
  farm,
  onClose,
}) => {
  const form = useForm<StakeFormModel>({
    percent: 100,
    xAmount: farm.availableToStakeX,
    yAmount: farm.availableToStakeY,
    lpAmount: farm.availableToStakeLq,
  });
  useSubscription(
    form.controls.percent.valueChangesWithSilent$.pipe(skip(1)),
    (percent) => {
      form.patchValue({
        xAmount:
          percent === 100
            ? farm.availableToStakeX
            : farm.availableToStakeX.percent(percent),
        yAmount:
          percent === 100
            ? farm.availableToStakeY
            : farm.availableToStakeY.percent(percent),
        lpAmount:
          percent === 100
            ? farm.availableToStakeLq
            : farm.availableToStakeLq.percent(percent),
      });
    },
    [],
  );

  const action = (form: FormGroup<StakeFormModel>) => {
    if (form.value.lpAmount) {
      fireOperationAnalyticsEvent('Farm Stake Confirm Modal', (ctx) =>
        mapToStakeAnalyticsProps(form.value, farm, ctx),
      );
      onClose(
        walletLmDeposit(farm, form.value.lpAmount).pipe(
          tap(
            () => {
              fireOperationAnalyticsEvent('Farm Stake Sign Success', (ctx) =>
                mapToStakeAnalyticsProps(form.value, farm, ctx),
              );
            },
            (err) => {
              if (err.code === 2) {
                fireOperationAnalyticsEvent('Farm Stake Cancel Sign', (ctx) =>
                  mapToStakeAnalyticsProps(form.value, farm, ctx),
                );
              } else {
                fireOperationAnalyticsEvent(
                  'Farm Stake Confirm Modal Error',
                  (ctx) => ({
                    error_string: JSON.stringify(err),
                    ...mapToStakeAnalyticsProps(form.value, farm, ctx),
                  }),
                );
              }
            },
          ),
        ),
        form.value,
      );
    }
  };

  return (
    <Form form={form} onSubmit={action}>
      <Flex col>
        <Flex.Item marginBottom={6}>
          <PageSection title={t`Amount`} noPadding>
            <Flex col>
              <Form.Item name="percent">
                {({ value, onChange }) => (
                  <FormSlider value={value} onChange={onChange} />
                )}
              </Form.Item>
              <Form.Listener>
                {({ value }) => (
                  <FormPairSection
                    noBorder
                    title={''}
                    xAmount={value.xAmount}
                    yAmount={value.yAmount}
                  />
                )}
              </Form.Listener>
            </Flex>
          </PageSection>
        </Flex.Item>
        <Button
          size="extra-large"
          type="primary"
          htmlType="submit"
          width="100%"
        >
          {t`Stake`}
        </Button>
      </Flex>
    </Form>
  );
};
