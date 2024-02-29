import { Flex, Form, FormGroup, Typography, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation } from '@spectrumlabs/analytics';
import { useMemo } from 'react';
import { combineLatest, first, map, switchMap } from 'rxjs';

import { AssetLock, AssetLockStatus } from '../../../common/models/AssetLock';
import { Position } from '../../../common/models/Position.ts';
import { AssetLocksTable } from '../../../components/AssetLocksTable/AssetLocksTable.tsx';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection.tsx';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal.tsx';
import {
  OperationForm,
  OperationValidator,
} from '../../../components/OperationForm/OperationForm.tsx';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader.tsx';
import { useAssetsBalance } from '../../../gateway/api/assetBalance.ts';
import { useSettings } from '../../../gateway/settings/settings.ts';
import { networkContext$ } from '../../../network/cardano/api/networkContext/networkContext.ts';
import { ammTxFeeMapping } from '../../../network/cardano/api/operations/common/ammTxFeeMapping.ts';
import { transactionBuilder$ } from '../../../network/cardano/api/operations/common/transactionBuilder.ts';
import { CardanoSettings } from '../../../network/cardano/settings/settings.ts';
import { WithdrawalLiquidityConfirmationModal } from './WithdrawalLiquidityConfirmationModal/WithdrawalLiquidityConfirmationModal.tsx';

interface RelockLiquidityModel {
  lockedPosition?: AssetLock;
}

export const CardanoWithdrawalLiquidity = ({
  position,
}: {
  position: Position;
}): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
  });
  const [balance] = useAssetsBalance();
  const { address } = useSettings() as CardanoSettings;

  const txValidator: OperationValidator<RelockLiquidityModel> = (
    form: FormGroup<RelockLiquidityModel>,
  ) => {
    if (!form.value.lockedPosition) {
      return undefined;
    }
    return combineLatest([networkContext$.pipe(first()), transactionBuilder$])
      .pipe(
        switchMap(([nc, tb]) => {
          return tb.unlock({
            redeemer: form.value.lockedPosition?.redeemer as any,
            changeAddress: address!,
            collateralAmount: 4000000n,
            slotNo: nc.slotNo,
            txFees: ammTxFeeMapping,
            boxId: form.value.lockedPosition?.boxId as any,
          });
        }),
      )
      .pipe(
        map((data) => {
          if (data[0]) {
            return undefined;
          }
          if ((data[3] as any).includes('collateral')) {
            return 'Insufficient collateral';
          }
          return 'Insufficient ada for fees';
        }),
      );
  };

  const validators: OperationValidator<RelockLiquidityModel>[] = useMemo(
    () => [
      (form: FormGroup<RelockLiquidityModel>) =>
        !form.value.lockedPosition && t`Select Locked Position`,
      (form: FormGroup<RelockLiquidityModel>) =>
        form.value.lockedPosition?.status === AssetLockStatus.LOCKED &&
        t`This position is still locked`,
      txValidator,
    ],
    [balance],
  );

  const handleRelockLiquidity = (form: FormGroup<RelockLiquidityModel>) => {
    const lockedPosition = form.value.lockedPosition;
    if (lockedPosition) {
      openConfirmationModal(
        (next) => (
          <WithdrawalLiquidityConfirmationModal
            onClose={next}
            lock={lockedPosition}
          />
        ),
        Operation.WITHDRAWAL_LIQUIDITY,
        {
          assetLock: lockedPosition,
        },
      );
    }
  };

  return (
    <OperationForm
      traceFormLocation={ElementLocation.withdrawLiquidityForm}
      form={form}
      validators={validators}
      onSubmit={handleRelockLiquidity}
      actionCaption={t`Withdrawal`}
    >
      <Flex col>
        <Flex.Item marginBottom={2}>
          <PageHeader position={position} />
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Flex>
            <Flex.Item flex={1} marginRight={2}>
              <FormPairSection
                glass
                title={t`Total in locker`}
                xAmount={position.lockedX}
                yAmount={position.lockedY}
              />
            </Flex.Item>
            <Flex.Item flex={1}>
              <FormPairSection
                glass
                title={t`Withdrawable`}
                xAmount={position.withdrawableLockedX}
                yAmount={position.withdrawableLockedY}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <Typography.Body strong>
            <Trans>Locked positions</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Form.Item name="lockedPosition">
            {({ value, onChange }) => (
              <AssetLocksTable
                locks={position?.locks || []}
                value={value}
                onChange={onChange}
              />
            )}
          </Form.Item>
        </Flex.Item>
      </Flex>
    </OperationForm>
  );
};
