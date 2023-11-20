import { useDevice } from '@ergolabs/ui-kit';

import { useObservable } from '../../../../common/hooks/useObservable';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { WalletState } from '../../../../network/common/Wallet';
import Navigation from '../Header/Navigation/Navigation';
import { OperationsHistory } from '../OperationsHistory/OperationsHistory';
import styles from './FooterNavigation.module.less';

export default function FooterNavigation() {
  const { s } = useDevice();
  const [walletState] = useObservable(selectedWalletState$);

  if (!s) {
    return null;
  } else {
    return (
      <footer className={styles.footerNavigation}>
        <Navigation />
        {walletState === WalletState.CONNECTED && (
          <div>
            <OperationsHistory />
          </div>
        )}
      </footer>
    );
  }
}
