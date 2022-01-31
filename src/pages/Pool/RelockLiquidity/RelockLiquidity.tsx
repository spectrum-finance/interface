import { blocksToMillis, PoolId } from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { map } from 'rxjs';

import { ergoExplorerContext$ } from '../../../api/explorer';
import { getLocksByPool } from '../../../api/locks';
import { getPositionByAmmPoolId } from '../../../api/positions';
import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { AssetLock } from '../../../common/models/AssetLock';
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
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import {
  Animation,
  Flex,
  List,
  Skeleton,
  Typography,
} from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { LiquidityDatePicker } from '../components/LockLiquidityDatePicker/LiquidityDatePicker';
import { RelockLiquidityConfirmationModal } from './RelockLiquidityConfirmationModal/RelockLiquidityConfirmationModal';

interface RelockLiquidityModel {
  lockedPosition?: AssetLock;
  relocktime?: DateTime;
}

export const RelockLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
    relocktime: undefined,
  });
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId);
  const [locks, updateLocks] = useSubject(getLocksByPool);

  const [explorerContext] = useObservable(ergoExplorerContext$);

  const currentBlock = explorerContext ? explorerContext.height : undefined;

  const validators: OperationValidator<RelockLiquidityModel>[] = [
    (form) => !form.value.lockedPosition && 'Select Locked Position',
    (form) => !form.value.relocktime && 'Pick new unlock date',
  ];

  useEffect(() => updatePosition(poolId), []);
  useEffect(() => {
    if (position) updateLocks(position.pool);
  }, [position]);

  const [isLockedPositionSelected] = useObservable(
    form.controls.lockedPosition.valueChanges$.pipe(map(Boolean)),
  );

  const handleRelockLiquidity = (form: FormGroup<RelockLiquidityModel>) => {
    const lockedPosition = form.value.lockedPosition;
    const relocktime = form.value.relocktime;

    if (lockedPosition && relocktime) {
      openConfirmationModal(
        (next) => (
          <RelockLiquidityConfirmationModal
            onClose={next}
            lockedPosition={lockedPosition}
            relocktime={relocktime}
          />
        ),
        Operation.RELOCK_LIQUIDITY,
        {
          assetLock: lockedPosition,
          time: relocktime,
        },
      );
    }
  };

  return (
    <Page width={760} title="Relock liquidity" withBackButton>
      {position && locks && explorerContext ? (
        <OperationForm
          actionCaption="Relock position"
          form={form}
          onSubmit={handleRelockLiquidity}
          validators={validators}
        >
          <Flex col>
            <Flex.Item marginBottom={2}>
              <PageHeader x={position.x} y={position.y} />
            </Flex.Item>
            <Flex.Item>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>
                    Select Locked Position
                  </Typography.Body>
                </Flex.Item>
                <Form.Item name="lockedPosition">
                  {({ value, onChange }) => (
                    <List dataSource={locks} gap={2}>
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
              </Flex>
            </Flex.Item>
            {isLockedPositionSelected && (
              <Flex.Item marginTop={4}>
                <Animation.Expand expanded={isLockedPositionSelected}>
                  <PageSection title="Unlock date">
                    <Form.Item name="relocktime">
                      {({ value, onChange }) => (
                        <LiquidityDatePicker
                          value={value}
                          selectedPrefix="Extension period"
                          defaultValue="Select relock date"
                          onChange={onChange}
                          disabledDate={(current) => {
                            const dl = form.value.lockedPosition?.deadline;
                            if (dl && currentBlock) {
                              if (currentBlock < dl) {
                                return (
                                  current.minus({
                                    days: 1,
                                    millisecond: Number(
                                      blocksToMillis(dl - currentBlock),
                                    ),
                                  }) <= DateTime.now()
                                );
                              }
                            }
                            return (
                              current.toMillis() <= DateTime.now().toMillis()
                            );
                          }}
                        />
                      )}
                    </Form.Item>
                  </PageSection>
                </Animation.Expand>
              </Flex.Item>
            )}
          </Flex>
        </OperationForm>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
