import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode, useState } from 'react';

import { SwapFormModel } from '../../pages/Swap/SwapFormModel.ts';
import { SimpleCollapse } from '../SimpeCollapse/SimpeCollapse.tsx';
import { RatioView } from './RatioView/RatioView.tsx';

export interface BaseSwapCollapseProps {
  value: SwapFormModel;
  totalFees: ReactNode;
  children: ReactNode;
  contentHeight: number;
}

export const BaseSwapCollapse: FC<BaseSwapCollapseProps> = ({
  value,
  totalFees,
  children,
  contentHeight = 116,
}) => {
  const [reversedRatio, setReversedRatio] = useState(false);
  const { s, valBySize } = useDevice();

  return (
    <SimpleCollapse
      contentHeight={contentHeight}
      title={
        <Flex
          col={s}
          justify="space-between"
          align={s ? 'flex-start' : 'center'}
        >
          <Flex.Item marginRight={2}>
            <RatioView
              value={value}
              isReversed={reversedRatio}
              setReversed={setReversedRatio}
            />
          </Flex.Item>

          <Flex align="center">
            <Flex.Item flex={1}>
              <Typography.Body size={valBySize('small', 'base')}>
                <Trans>Fees:</Trans>
              </Typography.Body>
            </Flex.Item>
            <Flex.Item marginLeft={1}>
              <Typography.Body size={valBySize('small', 'base')}>
                {totalFees}
              </Typography.Body>
            </Flex.Item>
          </Flex>
        </Flex>
      }
    >
      {children}
    </SimpleCollapse>
  );
};
