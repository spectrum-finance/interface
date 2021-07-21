import { Text, Button } from '@geist-ui/react';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faHistory } from '@fortawesome/free-solid-svg-icons';
import { ConnectWallet } from '../../ConnectWallet/ConnectWallet';
import css from './header.module.scss';
import { SettingsModal } from '../../Settings/SettingsModal';
import { useToggle } from '../../../hooks/useToggle';
import { WalletContext } from '../../../context/WalletContext';
import { HistoryModal } from '../../History/HistoryModal';

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

const HistoryButton = (): JSX.Element => {
  const [open, handleOpen, handleClose] = useToggle(false);

  return (
    <div>
      <Button
        auto
        type="abort"
        disabled={open}
        icon={<FontAwesomeIcon icon={faHistory} size="lg" />}
        onClick={handleOpen}
      />
      <HistoryModal open={open} onClose={handleClose} />
    </div>
  );
};

const Header = (): JSX.Element => {
  const { isWalletConnected } = useContext(WalletContext);

  return (
    <header className={css.header}>
      <Text h2 className={css.main}>
        ErgoDEX Beta
      </Text>
      <SettingsButton />
      {isWalletConnected && <HistoryButton />}
      <ConnectWallet />
    </header>
  );
};

export default Header;
