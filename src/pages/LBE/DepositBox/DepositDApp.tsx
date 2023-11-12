import { ARROW_DOWN, TOKEN_ADA, TOKEN_TEDY } from '../../../utils/images';
import styles from './DepositDApp.module.less';

export default function DepositDApp() {
  return (
    <section className={styles.boxDepositWallet}>
      <h2 className={styles.boxTitle}>Deposit ADA (via dApp wallet)</h2>
      <div className={styles.inputCard}>
        <p className={styles.titleInput}>Deposit Amount</p>
        <div className={styles.inputContent}>
          <input type="number" className={styles.input} placeholder="0.0" />
          <div className={styles.tokenGroup}>
            <img
              src={TOKEN_ADA}
              alt="token-ada"
              className={styles.tokenImage}
            />
            <p className={styles.tokenName}>ADA</p>
          </div>
        </div>
      </div>
      <div className={styles.iconContainer}>
        <svg width="34" height="34" className={styles.icon}>
          <use href={ARROW_DOWN} />
        </svg>
      </div>
      <div className={styles.inputCard}>
        <p className={styles.titleInput}>TEDY Amount (estimated)</p>
        <div className={`${styles.inputContent} ${styles.resultContent}`}>
          <p className={styles.result}>{0.0}</p>
          <div className={styles.tokenGroup}>
            <img
              src={TOKEN_TEDY}
              alt="token-tedy"
              className={styles.tokenImage}
            />
            <p className={styles.tokenName}>TEDY</p>
          </div>
        </div>
      </div>
      <button className={styles.btnDeposit}>Deposit</button>
    </section>
  );
}
