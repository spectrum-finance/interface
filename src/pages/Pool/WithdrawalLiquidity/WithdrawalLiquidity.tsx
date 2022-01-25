import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { map } from 'rxjs';

import { ergoExplorerContext$ } from '../../../api/explorer';
import { getLockAccumulatorByPoolId, getLocksByPool } from '../../../api/locks';
import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { AssetLock, AssetLockStatus } from '../../../common/models/AssetLock';
import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Flex, List, Skeleton, Typography } from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { getAvailablePoolDataById } from '../../../services/new/pools';
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

  const [isButtonDisabled] = useObservable(
    form.controls.lockedPosition.valueChanges$.pipe(
      map((lock) => lock?.status === AssetLockStatus.LOCKED || !lock),
    ),
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
    <FormPageWrapper width={760} title="Withdraw" withBackButton>
      {locksAccumulator ? (
        <Form form={form} onSubmit={(form) => handleRelockLiquidity(form)}>
          <Flex col>
            <Flex.Item marginBottom={2}>
              <FormHeader x={locksAccumulator.x} y={locksAccumulator.y} />
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
            <Flex.Item marginBottom={4}>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>Locked positions</Typography.Body>
                </Flex.Item>
                <Form.Item name="lockedPosition">
                  {({ value, onChange }) => (
                    <List dataSource={locksAccumulator.locks} gap={2}>
                      {(item) => {
                        return (
                          <LockedPositionItem
                            pool={locksAccumulator.pool}
                            assetLock={item}
                            isActive={value?.boxId === item.boxId}
                            onClick={() => onChange(item)}
                          />
                        );
                      }}
                    </List>
                  )}
                </Form.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <SubmitButton disabled={isButtonDisabled} htmlType="submit">
                {isButtonDisabled ? 'Choose a deposit' : 'Withdraw'}
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
