import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { getLockAccumulatorByPoolId } from '../../../api/locks';
import { useSubject } from '../../../common/hooks/useObservable';
import { AssetLock, AssetLockStatus } from '../../../common/models/AssetLock';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import {
  OperationForm,
  OperationValidator,
} from '../../../components/OperationForm/OperationForm';
import { Page } from '../../../components/Page/Page';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader';
import { Flex, List, Skeleton, Typography } from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { WithdrawalLiquidityConfirmationModal } from './WithdrawalLiquidityConfirmationModal/WithdrawalLiquidityConfirmationModal';

interface RelockLiquidityModel {
  lockedPosition?: AssetLock;
}

export const WithdrawalLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
  });
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [locksAccumulator, updateLocksAccumulator] = useSubject(
    getLockAccumulatorByPoolId,
  );
  useEffect(() => updateLocksAccumulator(poolId), []);

  const validators: OperationValidator<RelockLiquidityModel>[] = [
    (form: FormGroup<RelockLiquidityModel>) =>
      !form.value.lockedPosition && 'Select Locked Position',
    (form: FormGroup<RelockLiquidityModel>) =>
      form.value.lockedPosition?.status === AssetLockStatus.LOCKED &&
      'This position is still locked',
  ];

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
    <Page width={760} title="Withdrawal" withBackButton>
      {locksAccumulator ? (
        <OperationForm
          form={form}
          validators={validators}
          onSubmit={handleRelockLiquidity}
          actionCaption="Withdrawal"
        >
          <Flex col>
            <Flex.Item marginBottom={2}>
              <PageHeader x={locksAccumulator.x} y={locksAccumulator.y} />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex>
                <Flex.Item flex={1} marginRight={2}>
                  <FormPairSection
                    title="Total in locker"
                    xAmount={locksAccumulator.x}
                    yAmount={locksAccumulator.y}
                  />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <FormPairSection
                    title="Withdrawable"
                    xAmount={locksAccumulator.withdrawableX}
                    yAmount={locksAccumulator.withdrawableY}
                  />
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <Typography.Body strong>Locked positions</Typography.Body>
            </Flex.Item>
            <Flex.Item>
              <Form.Item name="lockedPosition">
                {({ value, onChange }) => (
                  <List dataSource={locksAccumulator.locks} gap={2}>
                    {(item) => (
                      <LockedPositionItem
                        pool={locksAccumulator.pool}
                        assetLock={item}
                        isActive={value?.boxId === item.boxId}
                        onClick={() => onChange(item)}
                      />
                    )}
                  </List>
                )}
              </Form.Item>
            </Flex.Item>
          </Flex>
        </OperationForm>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
