import { mkLockParser } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { mkLocksHistory } from '@ergolabs/ergo-dex-sdk/build/main/security/services/locksHistory';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { map } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormSection } from '../../../components/common/FormView/FormSection/FormSection';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Animation, Flex, List, Typography } from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { mockCurrency } from '../../../mocks/asset';
import { addresses$ } from '../../../network/ergo/addresses/addresses';
import { explorer } from '../../../services/explorer';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';
import { LiquidityDatePicker } from '../components/LockLiquidityDatePicker/LiquidityDatePicker';

const xMock = mockCurrency;
const yMock = mockCurrency;
const mockedData = [
  { id: '1234', status: 'Withdrawable' },
  { id: '1235', status: 'Withdrawable' },
  { id: '1236', status: 'Locked' },
  { id: '1237', status: 'Locked' },
];

interface RelockLiquidityModel {
  lockedPosition?: any;
  relocktime?: DateTime;
}

export const RelockLiquidity = (): JSX.Element => {
  const form = useForm<RelockLiquidityModel>({
    lockedPosition: undefined,
    relocktime: undefined,
  });

  const [addresses] = useObservable(addresses$);

  const [history, setHistory] = useState<TokenLock[] | undefined>();

  useEffect(() => {
    if (addresses) {
      const parser = mkLockParser();
      mkLocksHistory(explorer, parser)
        .getAllByAddresses(addresses)
        .then((hs) => {
          setHistory(hs);
        });
    }
  }, [addresses]);

  console.log('addresses >>', addresses);
  console.log('history >>', history);

  const [isLockedPositionSelected] = useObservable(
    form.controls.lockedPosition.valueChanges$.pipe(map(Boolean)),
  );

  const handleRelockClick = (form: FormGroup<RelockLiquidityModel>) => {
    console.log(form.value);
  };

  return (
    <FormPageWrapper width={760} title="Relock liquidity" withBackButton>
      <Form form={form} onSubmit={handleRelockClick}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <FormHeader x={xMock} y={yMock} />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Flex col>
              <Flex.Item marginBottom={2}>
                <Typography.Body strong>Select Locked Position</Typography.Body>
              </Flex.Item>
              <Form.Item name="lockedPosition">
                {({ value, onChange }) => (
                  <List dataSource={mockedData} gap={2}>
                    {(item) => {
                      return (
                        <LockedPositionItem
                          isActive={value?.id === item.id}
                          onClick={() => onChange(item)}
                          status={item.status}
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
            <SubmitButton
              disabled={!isLockedPositionSelected}
              htmlType="submit"
            >
              Relock position
            </SubmitButton>
          </Flex.Item>
        </Flex>
      </Form>
    </FormPageWrapper>
  );
};
