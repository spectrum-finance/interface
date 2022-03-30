import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { skip } from 'rxjs';

import { getPositionByAmmPoolId } from '../../../api/positions';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Position } from '../../../common/models/Position';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { Page } from '../../../components/Page/Page';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Flex, Form, FormGroup, Skeleton, useForm } from '../../../ergodex-cdk';
import { RemoveLiquidityConfirmationModal } from './RemoveLiquidityConfirmationModal/RemoveLiquidityConfirmationModal';

interface RemoveFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}

export const RemoveLiquidity: FC = () => {
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId);
  const form = useForm<RemoveFormModel>({
    percent: 100,
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);

  useEffect(() => updatePosition(poolId), []);

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

    openConfirmationModal(
      (next) => {
        return (
          <RemoveLiquidityConfirmationModal
            onClose={next}
            xAmount={xAmount}
            yAmount={yAmount}
            lpAmount={lpAmount}
            pool={poolData.pool}
          />
        );
      },
      Operation.REMOVE_LIQUIDITY,
      {
        xAsset: xAmount,
        yAsset: yAmount,
      },
    );
  };

  return (
    <Page width={382} title={t`Remove liquidity`} withBackButton>
      {position ? (
        <Form form={form} onSubmit={(form) => handleRemove(form, position)}>
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <PageHeader position={position} />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PageSection title={t`Amount`} noPadding>
                <Form.Item name="percent">
                  {({ value, onChange }) => (
                    <FormSlider value={value} onChange={onChange} />
                  )}
                </Form.Item>
              </PageSection>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormPairSection
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
              <SubmitButton disabled={!formValue?.percent} htmlType="submit">
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
