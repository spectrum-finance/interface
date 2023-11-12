import DepositDApp from './DepositBox/DepositDApp';
import DepositManual from './DepositBox/DepositManual';
import DetailsLBE from './Details/DetailsLBE';
import styles from './LBE.module.less';

export default function LBE() {
  return (
    <main className={styles.lbeContainer}>
      <div className={styles.depositGroup}>
        <DepositDApp />
        <DepositManual />
      </div>
      <DetailsLBE />
    </main>
  );
}
