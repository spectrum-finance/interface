import { blocksToMillis, PoolId } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { combineLatest, map } from 'rxjs';

import { ergoExplorerContext$ } from '../../../api/explorer';
import { getLocksByPool } from '../../../api/locks';
import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { AssetLock } from '../../../common/models/AssetLock';
import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormSection } from '../../../components/common/FormView/FormSection/FormSection';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
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
import { mockCurrency } from '../../../mocks/asset';
import {
  getAvailablePoolDataById,
  PoolData,
} from '../../../services/new/pools';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { LiquidityDatePicker } from '../components/LockLiquidityDatePicker/LiquidityDatePicker';
import { RelockLiquidityConfirmationModal } from './RelockLiquidityConfirmationModal/RelockLiquidityConfirmationModal';

interface RelockLiquidityModel {
  lockedPosition?: AssetLock;
  relocktime?: DateTime;
}

const getLockStatus = (currentHeight: number, deadline: number) => {
  if (currentHeight < deadline) return 'Locked';
  return 'Withdrawable';
};

export const RelockLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
    relocktime: undefined,
  });
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [poolData, updatePoolData] = useSubject(getAvailablePoolDataById);
  const [locks, updateLocks] = useSubject(getLocksByPool);

  const [explorerContext] = useObservable(ergoExplorerContext$);

  const currentBlock = explorerContext ? explorerContext.height : undefined;

  useEffect(() => updatePoolData(poolId), []);
  useEffect(() => {
    if (poolData) updateLocks(poolData.pool);
  }, [poolData]);

  const [isLockedPositionSelected] = useObservable(
    form.controls.lockedPosition.valueChanges$.pipe(map(Boolean)),
  );

  const [isNotDisabled] = useObservable(
    combineLatest([
      form.controls.lockedPosition.valueChanges$,
      form.controls.relocktime.valueChanges$,
    ]).pipe(map(([first, second]) => !!first && !!second)),
  );

  console.log('form.value >>', form.value);

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
    <FormPageWrapper width={760} title="Relock liquidity" withBackButton>
      {poolData && locks && explorerContext ? (
        <Form form={form} onSubmit={(form) => handleRelockLiquidity(form)}>
          <Flex col>
            <Flex.Item marginBottom={2}>
              <FormHeader x={poolData.xAmount} y={poolData.yAmount} />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex col>
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>
                    Select Locked Position
                  </Typography.Body>
                </Flex.Item>
                <Form.Item name="lockedPosition">
                  {({ value, onChange }) => (
                    <List dataSource={locks} gap={2}>
                      {(item) => {
                        return (
                          <LockedPositionItem
                            pool={poolData.pool}
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
            {isLockedPositionSelected && (
              <Flex.Item marginBottom={4}>
                <Animation.Expand expanded={isLockedPositionSelected}>
                  <FormSection title="Unlock date">
                    <Form.Item name="relocktime">
                      {({ value, onChange }) => (
                        <LiquidityDatePicker
                          value={value}
                          selectedPrefix="Prefix"
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
                  </FormSection>
                </Animation.Expand>
              </Flex.Item>
            )}

            <Flex.Item>
              <SubmitButton disabled={!isNotDisabled} htmlType="submit">
                Relock position
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
