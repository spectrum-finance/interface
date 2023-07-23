import { CloseCircleFilled, Flex, Tag, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

const _PriceImpactWarning: FC<{ className?: string }> = ({ className }) => (
  <Tag color="error" className={className}>
    <Flex width="100%">
      <Flex.Item marginRight={2}>
        <CloseCircleFilled
          style={{ fontSize: 16, position: 'relative', top: '4px' }}
        />
      </Flex.Item>
      <Typography.Body>
        This swap could lead to potential losses! The price impact is currently
        significant due to the existing liquidity in the pool. Ensure you fully
        understand the implications before moving forward.
      </Typography.Body>
    </Flex>
  </Tag>
);

export const PriceImpactWarning = styled(_PriceImpactWarning)`
  padding: calc(var(--spectrum-base-gutter) * 2)
    calc(var(--spectrum-base-gutter) * 4);
  text-align: justify;
  text-wrap: initial;
  width: 100%;
`;
