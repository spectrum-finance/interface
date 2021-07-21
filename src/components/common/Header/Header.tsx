import { Image, Button } from '@geist-ui/react';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faHistory } from '@fortawesome/free-solid-svg-icons';
import { ConnectWallet } from '../../ConnectWallet/ConnectWallet';
import css from './header.module.scss';
import { SettingsModal } from '../../Settings/SettingsModal';
import { useToggle } from '../../../hooks/useToggle';
import { WalletContext } from '../../../context/WalletContext';
import { HistoryModal } from '../../History/HistoryModal';
import logo from '../../../assets/images/logo.svg';

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

type Props = {
  showNav?: boolean;
};

const Header: React.FC<Props> = ({ showNav = true }) => {
  const { isWalletConnected } = useContext(WalletContext);

  // TODO: split this component to Header and Navbar components
  return (
    <header className={css.header}>
      <Image src={logo} className={css.main} />
      {!showNav && (
        <>
          <SettingsButton />
          {isWalletConnected && <HistoryButton />}
          <ConnectWallet />
        </>
      )}
    </header>
  );
};

export default Header;
