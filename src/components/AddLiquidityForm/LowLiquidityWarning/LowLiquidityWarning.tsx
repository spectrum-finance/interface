import { CloseCircleFilled, Flex, Tag, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

const _LowLiquidityWarning: FC<{ className?: string }> = ({ className }) => (
  <Tag color="error" className={className}>
    <Flex width="100%">
      <Flex.Item marginRight={2}>
        <CloseCircleFilled
          style={{ fontSize: 16, position: 'relative', top: '4px' }}
        />
      </Flex.Item>
      <Typography.Body>
        Note that there is little liquidity in this pool and the price may
        change right before you add liquidity. This could cause you to lose a
        significant portion of your assets permanently.
      </Typography.Body>
    </Flex>
  </Tag>
);

export const LowLiquidityWarning = styled(_LowLiquidityWarning)`
  padding: calc(var(--spectrum-base-gutter) * 2)
    calc(var(--spectrum-base-gutter) * 4);
  text-align: justify;
  text-wrap: initial;
  width: 100%;
`;
