import React from 'react';
import styled from 'styled-components';

import { Ratio } from '../../../../common/models/Ratio';

interface DifferenceViewProps {
  isPositive: boolean;
}

const DifferenceView = styled.span<DifferenceViewProps>`
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: ${(props) =>
    props.isPositive ? 'var(--ergo-success-color)' : 'var(--ergo-error-color)'};
`;

interface DifferenceProps {
  ratioX: Ratio;
  ratioY: Ratio;
}

export const Difference: React.FC<DifferenceProps> = ({ ratioX, ratioY }) => {
  const diff = ratioY.minus(ratioX);
  const isPositive = diff.isPositive();

  const arrow = isPositive ? '↑' : '↓';
  const percent = Number(
    Math.abs(diff.valueOf() / ratioX.valueOf()) * 100,
  ).toFixed(2);
  const diffValue = diff.toAbsoluteString();

  return (
    <DifferenceView
      isPositive={isPositive}
    >{`${arrow}${diffValue}(${arrow}${percent}%)`}</DifferenceView>
  );
};
