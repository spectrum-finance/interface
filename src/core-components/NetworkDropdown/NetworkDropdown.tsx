import './NetworkDropdown.less';

import { Button, Menu } from 'antd';
import cn from 'classnames';
import React, { useState } from 'react';

import cardanoLogoActive from '../../assets/images/cardano-logo.svg';
import cardanoLogoDisabled from '../../assets/images/cardano-logo-disabled.svg';
import ergoLogoActive from '../../assets/images/ergo-logo.svg';
import ergoLogoDisabled from '../../assets/images/ergo-logo-disabled.svg';
import { Dropdown } from '../Dropdown/Dropdown';
import { DownOutlined } from '../Icon/Icon';

type OverlayProps = {
  setNetwork: (value: string) => void;
  currentNetwork: string;
};

const Overlay: React.FC<OverlayProps> = ({ currentNetwork, setNetwork }) => (
  <Menu className="NetworkDropdown__menu" mode="vertical">
    <Menu.Item
      onClick={() =>
        setNetwork(currentNetwork === 'cardano' ? 'ergo' : 'cardano')
      }
    >
      <img
        className="NetworkDropdown__logo"
        src={currentNetwork === 'cardano' ? ergoLogoActive : cardanoLogoActive}
      />
      {currentNetwork === 'cardano' ? 'Ergo' : 'Cardano'}
    </Menu.Item>
  </Menu>
);

type Props = {
  disabled?: boolean;
};

export const NetworkDropdown: React.FC<Props> = ({ disabled }) => {
  const [network, setNetwork] = useState('ergo');

  const overlay = <Overlay currentNetwork={network} setNetwork={setNetwork} />;

  const cardanoLogo = disabled ? cardanoLogoDisabled : cardanoLogoActive;
  const ergoLogo = disabled ? ergoLogoDisabled : ergoLogoActive;

  return (
    <Dropdown disabled={disabled} overlay={overlay} placement="bottomLeft">
      <Button
        disabled={disabled}
        className={cn('NetworkDropdown__container', {
          'NetworkDropdown__container--cardano': network === 'cardano',
          'NetworkDropdown__container--ergo': network === 'ergo',
        })}
      >
        <img
          src={network === 'cardano' ? cardanoLogo : ergoLogo}
          className="NetworkDropdown__logo"
        />
        {network === 'cardano' ? 'Cardano' : 'Ergo'}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
