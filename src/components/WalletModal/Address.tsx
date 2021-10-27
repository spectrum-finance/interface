import './Address.less';

import React from 'react';

import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg';
import { ReactComponent as ExploreIcon } from '../../assets/icons/explore-icon.svg';
import { Space, Typography } from '../../ergodex-cdk';
import { getShortAddress } from '../../utils/address';
interface AddressProps {
  address: string;
}

export const Address: React.FC<AddressProps> = ({ address }) => {
  return (
    <Space size={0} className="address_wrapper">
      <Typography.Text strong>{getShortAddress(address)}</Typography.Text>
      <CopyIcon />
      <ExploreIcon />
    </Space>
  );
};
