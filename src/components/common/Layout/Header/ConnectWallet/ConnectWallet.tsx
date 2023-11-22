import { Modal } from '@ergolabs/ui-kit';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { isWalletSetuped$ } from '../../../../../gateway/api/wallets';
import { ChooseWalletModal } from '../../../ConnectWalletButton/ChooseWalletModal/ChooseWalletModal';
import NetworkDropdown from '../NetworkDropdown/NetworkDropdown';
import styles from './ConnectWallet.module.less';
import { WalletInfoButton } from './WalletInfoButton/WalletInfoButton';

export default function ConnectWallet() {
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };
  return (
    <>
      <NetworkDropdown />
      {isWalletConnected ? (
        <WalletInfoButton />
      ) : (
        <button className={styles.btnDeposit} onClick={openChooseWalletModal}>
          Connect Wallet
        </button>
      )}
    </>
  );
}
