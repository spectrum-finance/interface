import {
  Alert,
  Animation,
  Flex,
  Form,
  FormGroup,
  LockOutlined,
  useForm,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { AssetAmount } from '@spectrumlabs/cardano-dex-sdk';
import { FC, useState } from 'react';
import { skip, switchMap } from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../../common/hooks/useObservable.ts';
import { Currency } from '../../../common/models/Currency.ts';
import { Position } from '../../../common/models/Position.ts';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection.tsx';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider.tsx';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal.tsx';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader.tsx';
import { PageSection } from '../../../components/Page/PageSection/PageSection.tsx';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton.tsx';
import { useNetworkAsset } from '../../../gateway/api/networkAsset.ts';
import { ammTxFeeMapping } from '../../../network/cardano/api/operations/common/ammTxFeeMapping.ts';
import { transactionBuilder$ } from '../../../network/cardano/api/operations/common/transactionBuilder.ts';
import { useSettings } from '../../../network/cardano/settings/settings.ts';
import { LiquidityDatePicker } from '../../Liquidity/common/components/LockLiquidityDatePicker/LiquidityDatePicker.tsx';
import { LockLiquidityModel } from '../LockLiquidityModel.ts';
import { LockLiquidityConfirmationModal } from './LockLiquidityConfirmationModal/LockLiquidityConfirmationModal.tsx';

export const CardanoLockLiquidity: FC<{
  position: Position;
}> = ({ position }) => {
  const settings = useSettings();
  const [txStatus, setTxStatus] = useState<'error' | 'success' | 'loading'>(
    'loading',
  );
  const [txFee, setTxFee] = useState<undefined | Currency>(undefined);
  const form = useForm<LockLiquidityModel>({
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
    locktime: undefined,
    pool: undefined,
    percent: 100,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);
  const [networkAsset] = useNetworkAsset();

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

  useSubscription(form.valueChanges$, (value) => {
    const { locktime, lpAmount } = value;
    const lq = lpAmount || position.availableLp;

    if (!locktime) {
      return;
    }
    setTxStatus('loading');
    transactionBuilder$
      .pipe(
        switchMap((tb) =>
          tb.lock({
            pk: settings.ph!,
            changeAddress: settings.address!,
            lockedUntil: locktime.toMillis(),
            lq: new AssetAmount(lq.asset.data, lq.amount),
            txFees: ammTxFeeMapping,
          }),
        ),
      )
      .subscribe((data) => {
        setTxStatus(data[0] ? 'success' : 'error');
        setTxFee(new Currency(data[2].txFee, networkAsset));
      });
  });

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

    if (timelock && txFee) {
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
            txFee={txFee}
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
    <Form form={form} onSubmit={(form) => handleLockLiquidity(form, position)}>
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
            disabled={!formValue?.locktime || txStatus === 'error'}
            loading={txStatus === 'loading' && !!formValue?.locktime}
            htmlType="submit"
            icon={<LockOutlined />}
          >
            {txStatus === 'loading' && !!formValue?.locktime && t`Pending`}
            {!formValue?.locktime && t`Enter lock time`}
            {txStatus === 'success' && t`Lock`}
            {txStatus === 'error' && t`Insufficient ada for lock fees`}
          </SubmitButton>
        </Flex.Item>
      </Flex>
    </Form>
  );
};
