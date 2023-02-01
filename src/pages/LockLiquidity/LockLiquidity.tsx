import { PoolId } from '@ergolabs/ergo-dex-sdk';
import {
  Alert,
  Animation,
  Flex,
  Form,
  FormGroup,
  LockOutlined,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { Skeleton } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { skip } from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
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
import { useGuardV2 } from '../../hooks/useGuard';
import { LiquidityDatePicker } from '../Liquidity/common/components/LockLiquidityDatePicker/LiquidityDatePicker';
import { LockLiquidityConfirmationModal } from './LockLiquidityConfirmationModal/LockLiquidityConfirmationModal';
import { LockLiquidityModel } from './LockLiquidityModel';

const LockLiquidity = (): JSX.Element => {
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const navigate = useNavigate();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));

  const form = useForm<LockLiquidityModel>({
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
    locktime: undefined,
    pool: undefined,
    percent: 100,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);

  useGuardV2(
    () => !loading && !position?.availableLp?.isPositive(),
    () =>
      navigate(
        `../../../liquidity${position?.pool.id ? `/${position.pool.id}` : ''}`,
      ),
  );

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

  const handleLockLiquidity = (
    form: FormGroup<LockLiquidityModel>,
    position: Position,
  ) => {
    const xAsset = form.value.xAmount || position.availableX;
    const yAsset = form.value.yAmount || position.availableY;
    const lpAsset = form.value.lpAmount || position.availableLp;
    const timelock = form.value.locktime;
    const percent = form.value.percent;
    const pool = position.pool;

    if (timelock) {
      openConfirmationModal(
        (next) => (
          <LockLiquidityConfirmationModal
            onClose={next}
            xAsset={xAsset}
            yAsset={yAsset}
            lpAsset={lpAsset}
            timelock={timelock}
            percent={percent}
            pool={pool}
          />
        ),
        Operation.LOCK_LIQUIDITY,
        {
          xAsset,
          yAsset,
          lpAsset,
          time: timelock,
        },
      );
    }
  };

  return (
    <Page maxWidth={480} title={t`Lock liquidity`} withBackButton>
      {position ? (
        <Form
          form={form}
          onSubmit={(form) => handleLockLiquidity(form, position)}
        >
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <PageHeader position={position} />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PageSection glass title={t`Amount`} noPadding boxed={false}>
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
                title={t`Assets to lock`}
                xAmount={formValue?.xAmount || position.availableX}
                yAmount={formValue?.yAmount || position.availableY}
              />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PageSection title={t`Unlock date`} glass>
                <Form.Item name="locktime">
                  {({ value, onChange }) => (
                    <LiquidityDatePicker
                      selectedPrefix={t`Lock period`}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Form.Item>
              </PageSection>
            </Flex.Item>

            {!!formValue?.locktime && (
              <Flex.Item marginBottom={4}>
                <Animation.Expand expanded={!!formValue?.locktime}>
                  <Alert
                    type="warning"
                    message={t`Once LP-tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.`}
                  />
                </Animation.Expand>
              </Flex.Item>
            )}

            <Flex.Item>
              <SubmitButton
                disabled={!formValue?.locktime}
                htmlType="submit"
                icon={<LockOutlined />}
              >
                <Trans>Lock</Trans>
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

export { LockLiquidity };
