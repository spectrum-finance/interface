import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Skeleton } from 'antd';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { skip } from 'rxjs';

import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../../common/hooks/useObservable';
import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSection } from '../../../components/common/FormView/FormSection/FormSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Alert, Animation, Flex, LockOutlined } from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import {
  getAvailablePoolDataById,
  PoolData,
} from '../../../services/new/pools';
import { LockLiquidityConfirmationModal } from './LockLiquidityConfirmationModal/LockLiquidityConfirmationModal';
import { LockLiquidityDatePicker } from './LockLiquidityDatePicker/LockLiquidityDatePicker';
import { LockLiquidityModel } from './LockLiquidityModel';

const LockLiquidity = (): JSX.Element => {
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [poolData, updatePoolData] = useSubject(getAvailablePoolDataById);

  const form = useForm<LockLiquidityModel>({
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
    locktime: undefined,
    pool: undefined,
    percent: 100,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);

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

  const handleLockLiquidity = (
    form: FormGroup<LockLiquidityModel>,
    poolData: PoolData,
  ) => {
    const xAsset = form.value.xAmount || poolData.xAmount;
    const yAsset = form.value.yAmount || poolData.yAmount;
    const lpAsset = form.value.lpAmount || poolData.lpAmount;
    const timelock = form.value.locktime;
    const percent = form.value.percent;

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
          />
        ),
        Operation.LOCK_LIQUIDITY,
        {
          xAsset,
          yAsset,
          lpAsset,
          timelock,
        },
      );
    }
  };

  return (
    <FormPageWrapper width={480} title="Lock liquidity" withBackButton>
      {poolData ? (
        <Form
          form={form}
          onSubmit={(form) => handleLockLiquidity(form, poolData)}
        >
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <FormHeader x={poolData.xAmount} y={poolData.yAmount} />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormSection title="Amount" noPadding>
                <Form.Item name="percent">
                  {({ value, onChange }) => (
                    <FormSlider value={value} onChange={onChange} />
                  )}
                </Form.Item>
              </FormSection>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to lock"
                xAmount={formValue?.xAmount || poolData.xAmount}
                yAmount={formValue?.yAmount || poolData.yAmount}
              />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormSection title="Unlock date">
                <Form.Item name="locktime">
                  {({ value, onChange }) => (
                    <LockLiquidityDatePicker
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Form.Item>
              </FormSection>
            </Flex.Item>

            {!!formValue?.locktime && (
              <Flex.Item marginBottom={4}>
                <Animation.Expand expanded={!!formValue?.locktime}>
                  <Alert
                    type="warning"
                    message="Once LP-tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final."
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
                Lock
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

export { LockLiquidity };
