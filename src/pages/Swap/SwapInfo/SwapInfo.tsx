import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { Collapse } from '../../../ergodex-cdk';
import { swapInfoContent$ } from '../../../gateway/widgets/swapInfoContent';
import { SwapFormModel } from '../SwapFormModel';
import { SwapInfoHeader } from './SwapInfoHeader/SwapInfoHeader';

export interface SwapInfoProps {
  value: SwapFormModel;
  className?: string;
}

const _SwapInfo: FC<SwapInfoProps> = ({ className, value }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleCollapseChange = () => setCollapsed((prev) => !prev);
  const [SwapInfoContent] = useObservable(swapInfoContent$);

  return (
    <>
      {!!value.pool && (
        <Collapse className={className} onChange={handleCollapseChange}>
          <Collapse.Panel
            key="info"
            header={<SwapInfoHeader collapsed={collapsed} value={value} />}
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
  background: var(--ergo-box-bg-contrast);
  border: 1px solid var(--ergo-box-border-color);

  .ant-collapse-item,
  .ant-collapse-content,
  .ant-collapse-content-box {
    will-change: height;
    transform: translateZ(0);
  }

  .ant-collapse-content-box {
    background: var(--ergo-box-bg-contrast);
    border-radius: var(--ergo-border-radius-md);
    padding-top: 0;
  }
`;
