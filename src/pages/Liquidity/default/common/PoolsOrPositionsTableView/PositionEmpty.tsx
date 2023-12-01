import { Modal } from '@ergolabs/ui-kit';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { ChooseWalletModal } from '../../../../../components/common/ConnectWalletButton/ChooseWalletModal/ChooseWalletModal';
import { isWalletSetuped$ } from '../../../../../gateway/api/wallets';
import { BANK } from '../../../../../utils/images';
import styles from './PoolsOrPositionsTableView.module.less';

export default function PositionEmpty() {
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };
  return (
    <main className={styles.poolsPositionTable}>
      <section className={styles.thead}>
        <article className={`${styles.row} ${styles.asset}`}>
          <p className={styles.value}>Asset Pair</p>
        </article>
        <article className={`${styles.row} ${styles.tvl}`}>
          <p className={styles.value}>TVL</p>
        </article>
        <article className={`${styles.row} ${styles.volume}`}>
          <p className={styles.value}>Volume 24H</p>
        </article>
        <article className={`${styles.row} ${styles.fee}`}>
          <p className={styles.value}>Fee</p>
        </article>
      </section>
      <section className={`${styles.tbody} ${styles.positionEmpty}`}>
        <div className={styles.tbodyContent}>
          <svg width="40" height="40" className={styles.icon}>
            <use href={BANK} />
          </svg>
          <p className={styles.text}>
            Your liquidity positions will appear here.
          </p>
          {!isWalletConnected && (
            <button
              className={styles.btnLiquidity}
              onClick={openChooseWalletModal}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
