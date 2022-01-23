import { mkLockParser, PoolId } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { mkLocksHistory } from '@ergolabs/ergo-dex-sdk/build/main/security/services/locksHistory';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { combineLatest, map } from 'rxjs';

import { ergoExplorerContext$ } from '../../../api/explorer';
import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
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
import { addresses$ } from '../../../network/ergo/addresses/addresses';
import { explorer } from '../../../services/explorer';
import {
  getAvailablePoolDataById,
  PoolData,
} from '../../../services/new/pools';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { LiquidityDatePicker } from '../components/LockLiquidityDatePicker/LiquidityDatePicker';
import { RelockLiquidityConfirmationModal } from './RelockLiquidityConfirmationModal/RelockLiquidityConfirmationModal';

interface RelockLiquidityModel {
  lockedPosition?: TokenLock;
  relocktime?: DateTime;
}

export const RelockLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
    relocktime: undefined,
  });
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [poolData, updatePoolData] = useSubject(getAvailablePoolDataById);

  useEffect(() => updatePoolData(poolId), []);

  const [addresses] = useObservable(addresses$);
  const [explorerContext] = useObservable(ergoExplorerContext$);

  const [history, setHistory] = useState<TokenLock[] | undefined>();

  useEffect(() => {
    if (addresses) {
      const parser = mkLockParser();
      mkLocksHistory(explorer, parser)
        .getAllByAddresses(addresses)
        .then((lqHistory) => {
          const history = lqHistory.filter((item) => {
            return item.lockedAsset.asset.id === poolData?.lpAmount.asset.id;
          });
          setHistory(history);
        });
    }
  }, [addresses]);

  const [isLockedPositionSelected] = useObservable(
    form.controls.lockedPosition.valueChanges$.pipe(map(Boolean)),
  );

  const [isNotDisabled] = useObservable(
    combineLatest([
      form.controls.lockedPosition.valueChanges$,
      form.controls.relocktime.valueChanges$,
    ]).pipe(map(([first, second]) => !!first && !!second)),
  );

  const handleRelockLiquidity = (
    form: FormGroup<RelockLiquidityModel>,
    poolData: PoolData,
  ) => {
    const lockedPosition = form.value.lockedPosition;
    const timelock = form.value.relocktime;
    const pool = poolData.pool;

    const xAsset = mockCurrency;
    const yAsset = mockCurrency;
    const lpAsset = mockCurrency;

    if (lockedPosition && timelock) {
      openConfirmationModal(
        (next) => (
          <RelockLiquidityConfirmationModal
            share={99}
            onClose={next}
            timelock={timelock}
            pool={pool}
            xAsset={xAsset}
            yAsset={yAsset}
            lpAsset={lpAsset}
          />
        ),
        Operation.RELOCK_LIQUIDITY,
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
    <FormPageWrapper width={760} title="Relock liquidity" withBackButton>
      {poolData && history ? (
        <Form
          form={form}
          onSubmit={(form) => handleRelockLiquidity(form, poolData)}
        >
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
                    <List dataSource={history} gap={2}>
                      {(item: TokenLock) => {
                        return (
                          <LockedPositionItem
                            pool={poolData.pool}
                            unlockBlock={item.deadline}
                            status={'Locked'}
                            lockedAsset={
                              new Currency(
                                item.lockedAsset.amount,
                                item.lockedAsset.asset,
                              )
                            }
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
                          defaultValue="Select new unlock date"
                          onChange={onChange}
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
