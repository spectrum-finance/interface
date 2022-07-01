import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Flex, Form, FormGroup, Skeleton, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { skip } from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { Currency } from '../../common/models/Currency';
import { Position } from '../../common/models/Position';
import { FormPairSection } from '../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../components/common/FormView/FormSlider/FormSlider';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useGuard } from '../../hooks/useGuard';
import { RemoveLiquidityConfirmationModal } from './RemoveLiquidityConfirmationModal/RemoveLiquidityConfirmationModal';

interface RemoveFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}

export const RemoveLiquidity: FC = () => {
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const navigate = useNavigate();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));
  const form = useForm<RemoveFormModel>({
    percent: 100,
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
  });

  useGuard(position, loading, () => navigate('../../../pool'));

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
