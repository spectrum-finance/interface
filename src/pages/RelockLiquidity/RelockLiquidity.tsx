import { blocksToMillis, PoolId } from '@ergolabs/ergo-dex-sdk';
import {
  Animation,
  Flex,
  Form,
  FormGroup,
  Skeleton,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { map } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { AssetLock } from '../../common/models/AssetLock';
import { AssetLocksTable } from '../../components/AssetLocksTable/AssetLocksTable';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import {
  OperationForm,
  OperationValidator,
} from '../../components/OperationForm/OperationForm';
import { Page } from '../../components/Page/Page';
import { PageHeader } from '../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../components/Page/PageSection/PageSection';
import { ergoExplorerContext$ } from '../../gateway/api/explorer';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useGuard } from '../../hooks/useGuard';
import { LiquidityDatePicker } from '../Liquidity/components/LockLiquidityDatePicker/LiquidityDatePicker';
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
  const navigate = useNavigate();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId));

  const [explorerContext] = useObservable(ergoExplorerContext$);

  const currentBlock = explorerContext ? explorerContext.height : undefined;

  const validators: OperationValidator<RelockLiquidityModel>[] = [
    (form) => !form.value.lockedPosition && t`Select Locked Position`,
    (form) => !form.value.relocktime && t`Pick new unlock date`,
  ];

  useGuard(position, loading, () => navigate('../../../pool'));

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
          opName="relock-liquidity"
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
                    <AssetLocksTable
                      locks={position?.locks || []}
                      value={value}
                      onChange={onChange}
                    />
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
