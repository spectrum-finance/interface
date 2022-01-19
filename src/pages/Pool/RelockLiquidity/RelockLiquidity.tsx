import { BoxId } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormSection } from '../../../components/common/FormView/FormSection/FormSection';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Animation, Flex, List, Typography } from '../../../ergodex-cdk';
import { useForm } from '../../../ergodex-cdk/components/Form/NewForm';
import { mockCurrency } from '../../../mocks/asset';
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
  xAmount?: Currency;
  yAmount?: Currency;
  lpAmount?: Currency;
  relocktime?: DateTime;
  boxId?: BoxId;
}

export const RelockLiquidity = (): JSX.Element => {
  const [activeItemId, setActiveItemId] = useState<string | undefined>();

  const [dpval, setdpvalue] = useState<DateTime | null | undefined>();

  const form = useForm<RelockLiquidityModel>({
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
    relocktime: undefined,
    boxId: undefined,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);

  const handleSetActive = (id: string) => {
    setActiveItemId((prev) => {
      if (prev === id) return;
      return id;
    });
  };

  return (
    <FormPageWrapper width={760} title="Relock liquidity" withBackButton>
      <Flex col>
        <Flex.Item marginBottom={2}>
          <FormHeader x={xMock} y={yMock} />
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Flex col>
            <Flex.Item marginBottom={2}>
              <Typography.Body strong>Select Locked Position</Typography.Body>
            </Flex.Item>
            <List dataSource={mockedData} gap={2}>
              {(item) => {
                return (
                  <LockedPositionItem
                    isActive={item.id === activeItemId}
                    onClick={() => handleSetActive(item.id)}
                    status={item.status}
                  />
                );
              }}
            </List>
          </Flex>
        </Flex.Item>
        {activeItemId && (
          <Flex.Item marginBottom={4}>
            <Animation.Expand expanded={!!activeItemId}>
              <FormSection title="Unlock date">
                <LiquidityDatePicker
                  value={dpval}
                  selectedPrefix="Prefix"
                  defaultValue="Select new unlock date"
                  onChange={(val) => setdpvalue(val)}
                />
              </FormSection>
            </Animation.Expand>
          </Flex.Item>
        )}

        <Flex.Item>
          <SubmitButton disabled={!activeItemId} htmlType="submit">
            Relock position
          </SubmitButton>
        </Flex.Item>
      </Flex>
    </FormPageWrapper>
  );
};
