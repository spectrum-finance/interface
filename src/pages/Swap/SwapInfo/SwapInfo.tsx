import { Collapse } from '@ergolabs/ui-kit';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { swapInfoContent$ } from '../../../gateway/widgets/swapInfoContent';
import { SwapFormModel } from '../SwapFormModel';
import { SwapInfoHeader } from './SwapInfoHeader/SwapInfoHeader';

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
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleCollapseChange = () => setCollapsed((prev) => !prev);
  const [SwapInfoContent] = useObservable(swapInfoContent$);

  return (
    <>
      {!!value.pool && (
        <Collapse className={className} onChange={handleCollapseChange}>
          <Collapse.Panel
            key="info"
            header={
              <SwapInfoHeader
                collapsed={collapsed}
                value={value}
                isReversed={isReversed}
                setReversed={setReversed}
              />
            }
            showArrow={false}
          >
            {SwapInfoContent && <SwapInfoContent value={value} />}
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  );
};

export const SwapInfo = styled(_SwapInfo)`
  background: var(--ergo-box-bg-contrast) !important;
  border: 1px solid var(--ergo-box-border-color) !important;

  .ant-collapse-item,
  .ant-collapse-content,
  .ant-collapse-content-box {
    will-change: height;
    transform: translateZ(0);
  }

  .ant-collapse-header {
    align-items: center !important;
    min-height: 52px;
  }

  .ant-collapse-header-text {
    width: 100%;
  }

  .ant-collapse-content-box {
    background: var(--ergo-box-bg-contrast);
    border-radius: var(--ergo-border-radius-md);
    padding-top: 0;
  }
`;
