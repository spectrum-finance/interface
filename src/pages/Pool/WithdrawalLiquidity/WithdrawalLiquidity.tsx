import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { t, Trans } from '@lingui/macro';
import React, { useEffect } from 'react';

import { useSubject } from '../../../common/hooks/useObservable';
import { useParamsStrict } from '../../../common/hooks/useParamsStrict';
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
import {
  Flex,
  Form,
  FormGroup,
  List,
  Skeleton,
  Typography,
  useForm,
} from '../../../ergodex-cdk';
import { getPositionByAmmPoolId } from '../../../gateway/api/positions';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { WithdrawalLiquidityConfirmationModal } from './WithdrawalLiquidityConfirmationModal/WithdrawalLiquidityConfirmationModal';

interface RelockLiquidityModel {
  lockedPosition?: AssetLock;
}

export const WithdrawalLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
  });
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId);
  useEffect(() => updatePosition(poolId), []);

  const validators: OperationValidator<RelockLiquidityModel>[] = [
    (form: FormGroup<RelockLiquidityModel>) =>
      !form.value.lockedPosition && t`Select Locked Position`,
    (form: FormGroup<RelockLiquidityModel>) =>
      form.value.lockedPosition?.status === AssetLockStatus.LOCKED &&
      t`This position is still locked`,
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
    <Page width={760} title={t`Withdrawal`} withBackButton>
      {position ? (
        <OperationForm
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
                    title={t`Total in locker`}
                    xAmount={position.lockedX}
                    yAmount={position.lockedY}
                  />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <FormPairSection
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
                  <List dataSource={position.locks} gap={2}>
                    {(item) => (
                      <LockedPositionItem
                        pool={position.pool}
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
