import { Box, Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { useSettings } from '../../../gateway/settings/settings';
import { swapInfoContent$ } from '../../../gateway/widgets/swapInfoContent';
import { SwapFormModel } from '../SwapFormModel';
import { MoreInfoButton } from './MoreInfoButton/MoreInfoButton';
import { RatioView } from './RatioView/RatioView';
import { SwapInfoItem } from './SwapInfoItem/SwapInfoItem';

export interface SwapInfoProps {
  value: SwapFormModel;
  className?: string;
  isReversed: boolean;
  setReversed: (reversed: boolean) => void;
}

const _SwapInfo: FC<SwapInfoProps> = ({
  className,
  value,
  isReversed,
  setReversed,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [selectedNetwork] = useSelectedNetwork();

  const openedHeight = selectedNetwork.name === 'ergo' ? 166 : 202;

  const { slippage } = useSettings();

  const handleOpenedChange = () => setOpened((prev) => !prev);

  const [SwapInfoContent] = useObservable(swapInfoContent$);

  return (
    <>
      {!!value.pool && (
        <Box secondary padding={[2, 3]} borderRadius="l">
          <Flex col>
            <Flex.Item marginBottom={1}>
              <RatioView
                value={value}
                isReversed={isReversed}
                setReversed={setReversed}
              />
            </Flex.Item>
            <Flex.Item marginBottom={1}>
              <SwapInfoItem
                title={t`Slippage tolerance:`}
                value={slippage + '%'}
              />
            </Flex.Item>
            <div
              className={className}
              style={{ height: opened ? openedHeight : 22 }}
            >
              {SwapInfoContent && (
                <SwapInfoContent value={value} opened={opened} />
              )}
            </div>
            <MoreInfoButton onClick={handleOpenedChange} opened={opened} />
          </Flex>
        </Box>
      )}
    </>
  );
};

export const SwapInfo = styled(_SwapInfo)`
  overflow: hidden;
  transition: all 0.3s;
`;
