import './AddressView.less';

import React from 'react';

import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg';
import { ReactComponent as ExploreIcon } from '../../assets/icons/explore-icon.svg';
import { Address } from '../../context';
import { Row, Typography } from '../../ergodex-cdk';
import { getShortAddress } from '../../utils/address';
interface AddressViewProps {
  address: Address;
}

export const AddressView: React.FC<AddressViewProps> = ({ address }) => {
  return (
    <Row align="middle" className="address__wrapper">
      <Typography.Text strong>{getShortAddress(address)}</Typography.Text>
      <CopyIcon />
      <ExploreIcon />
    </Row>
  );
};
