import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { SimpleCollapse } from '../../../components/SimpeCollapse/SimpeCollapse.tsx';
import { swapInfoContent$ } from '../../../gateway/widgets/swapInfoContent';
import { SwapFormModel } from '../SwapFormModel';
import { RatioView } from './RatioView/RatioView';

export interface SwapInfoProps {
  value: SwapFormModel;
  isReversed: boolean;
  setReversed: (reversed: boolean) => void;
}

export const SwapInfo: FC<SwapInfoProps> = ({
  value,
  isReversed,
  setReversed,
}) => {
  const [SwapInfoContent] = useObservable(swapInfoContent$);
  const contentHeight = 116;

  return (
    <>
      {!!value.pool && (
        <SimpleCollapse
          contentHeight={contentHeight}
          title={
            <Flex justify="space-between">
              <RatioView
                value={value}
                isReversed={isReversed}
                setReversed={setReversed}
              />
              <Typography.Body>
                <Trans>Fees:</Trans> {`${12} ADA`}
              </Typography.Body>
            </Flex>
          }
        >
          {SwapInfoContent && <SwapInfoContent value={value} />}
        </SimpleCollapse>
      )}
    </>
  );
};
