import './PoolSelect.less';

import React from 'react';

import { Select } from '../../../ergodex-cdk';
import { MenuItem } from './MenuItem';

interface PoolMenuProps {
  value?: string | '';
  firstToken?: string | null;
  secondToken?: string | null;
  percent: number;
  disable?: boolean | false;
  className?: string;
}

const PoolMenu: React.FC<PoolMenuProps> = ({
  value,
  firstToken,
  secondToken,
  percent,
  disable,
  className,
}) => {
  const { Option } = Select;
  const content1 = (
    <MenuItem
      firstTokenName={firstToken}
      secondTokenName={secondToken}
      percentage={0.3}
    />
  );
  const content2 = (
    <MenuItem
      firstTokenName={firstToken}
      secondTokenName={secondToken}
      percentage={0.5}
    />
  );
  const content3 = (
    <MenuItem
      firstTokenName={firstToken}
      secondTokenName={secondToken}
      percentage={1}
    />
  );
  const content4 = (
    <MenuItem
      firstTokenName={firstToken}
      secondTokenName={secondToken}
      percentage={3}
    />
  );

  return (
    <Select
      className="liquidity__pool-select"
      placeholder="Select pool"
      disabled={disable}
      size="large"
    >
      <Option className="liquidity__pool-select-content" value={0.3}>
        {content1}
      </Option>
      <Option className="liquidity__pool-select-content" value={0.5}>
        {content2}
      </Option>
      <Option className="liquidity__pool-select-content" value={0.1}>
        {content3}
      </Option>
      <Option className="liquidity__pool-select-content" value={3}>
        {content4}
      </Option>
    </Select>
  );
};
export { PoolMenu };
