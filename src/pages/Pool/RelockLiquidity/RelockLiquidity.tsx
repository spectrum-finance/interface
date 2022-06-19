import { blocksToMillis, PoolId } from '@ergolabs/ergo-dex-sdk';
import {
  Animation,
  Flex,
  Form,
  FormGroup,
  List,
  Skeleton,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { map } from 'rxjs';

import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { useParamsStrict } from '../../../common/hooks/useParamsStrict';
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
import { ergoExplorerContext$ } from '../../../gateway/api/explorer';
import { getPositionByAmmPoolId } from '../../../gateway/api/positions';
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
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId);

  const [explorerContext] = useObservable(ergoExplorerContext$);

  const currentBlock = explorerContext ? explorerContext.height : undefined;

  const validators: OperationValidator<RelockLiquidityModel>[] = [
    (form) => !form.value.lockedPosition && t`Select Locked Position`,
    (form) => !form.value.relocktime && t`Pick new unlock date`,
  ];

  useEffect(() => updatePosition(poolId), []);

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
    <Page width={760} title={t`Relock liquidity`} withBackButton>
      {position && explorerContext ? (
        <OperationForm
          actionCaption={t`Relock position`}
          form={form}
          onSubmit={handleRelockLiquidity}
          validators={validators}
        >
          <Flex col>
            <Flex.Item marginBottom={2}>
              <PageHeader position={position} />
            </Flex.Item>
            <Flex.Item>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>
                    <Trans>Select Locked Position</Trans>
                  </Typography.Body>
                </Flex.Item>
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
              </Flex>
            </Flex.Item>
            {isLockedPositionSelected && (
              <Flex.Item marginTop={4}>
                <Animation.Expand expanded={isLockedPositionSelected}>
                  <PageSection title={t`Unlock date`}>
                    <Form.Item name="relocktime">
                      {({ value, onChange }) => (
                        <LiquidityDatePicker
                          value={value}
                          selectedPrefix={t`Extension period`}
                          defaultValue={t`Select relock date`}
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
