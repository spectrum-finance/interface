import React, { useState } from 'react';

import { FormHeader } from '../../../components/common/FormView/FormHeader/FormHeader';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { Flex, List } from '../../../ergodex-cdk';
import { mockCurrency } from '../../../mocks/asset';
import { LockedPositionItem } from '../components/LockedPositionItem/LockedPositionItem';

const xMock = mockCurrency;
const yMock = mockCurrency;
const mockedData = [{ id: '1234' }];

export const RelockLiquidity = (): JSX.Element => {
  const [activeItemId, setActiveItemId] = useState<string | undefined>();
  const handleSetActive = (id: string) => {
    setActiveItemId((prev) => {
      if (prev === id) return;
      return id;
    });
  };

  return (
    <FormPageWrapper width={760} title="Relock liquidity" withBackButton>
      <Flex col>
        <FormHeader x={xMock} y={yMock} />
        <Flex.Item marginBottom={4}>
          <List dataSource={mockedData} gap={2}>
            {(item) => {
              return (
                <LockedPositionItem
                  isActive={item.id === activeItemId}
                  onClick={() => handleSetActive(item.id)}
                />
              );
            }}
          </List>
        </Flex.Item>

        {activeItemId && <Flex.Item />}
        <Flex.Item>1</Flex.Item>
        <Flex.Item>1</Flex.Item>
        <Flex.Item>1</Flex.Item>
        <Flex.Item>1</Flex.Item>
        <Flex.Item>1</Flex.Item>
        <Flex.Item>1</Flex.Item>
      </Flex>
    </FormPageWrapper>
  );
};
