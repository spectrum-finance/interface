import { Text, Button } from '@geist-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { ConnectWallet } from '../../ConnectWallet/ConnectWallet';
import css from './header.module.scss';
import { SettingsModal } from '../../Settings/SettingsModal';
import { useToggle } from '../../../hooks/useToggle';

const Header = (): JSX.Element => {
  return (
    <header className={css.header}>
      <Text h2 className={css.main}>
        ErgoDEX
      </Text>
      <SettingsButton />
      <ConnectWallet />
    </header>
  );
};

export default Header;

const SettingsButton = (): JSX.Element => {
  const [open, handleOpen, handleClose] = useToggle(false);

  return (
    <div>
      <Button
        auto
        type="abort"
        disabled={open}
        icon={<FontAwesomeIcon icon={faCog} size="lg" />}
        onClick={handleOpen}
      />
      <SettingsModal open={open} onClose={handleClose} />
    </div>
  );
};
