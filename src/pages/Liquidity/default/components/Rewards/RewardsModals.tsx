import { CHECK_CIRCLE, X, X_CIRCLE } from '../../../../../utils/images';
import styles from './RewardsModals.module.less';

interface RewardsModalProps {
  transactionStatus: 'processing' | 'complete' | 'error' | undefined;
  setTransactionStatus: React.Dispatch<
    React.SetStateAction<'processing' | 'complete' | 'error' | undefined>
  >;
  data: number;
}

export default function RewardsModals(props: RewardsModalProps) {
  const { transactionStatus, setTransactionStatus, data } = props;

  return (
    <section className={styles.modal}>
      <div className={styles.main}>
        <div className={styles.popUp}>
          {transactionStatus !== 'processing' && (
            <svg
              width="36"
              height="36"
              className={styles.icon}
              onClick={() => setTransactionStatus(undefined)}
            >
              <use href={X} />
            </svg>
          )}

          <div className={styles.head}>
            {transactionStatus === 'processing' ? (
              <div className={styles.loader} />
            ) : transactionStatus === 'complete' ? (
              <svg width="80" height="80" className={styles.complete}>
                <use href={CHECK_CIRCLE} />
              </svg>
            ) : (
              <svg width="80" height="80" className={styles.error}>
                <use href={X_CIRCLE} />
              </svg>
            )}
          </div>
          <div className={styles.body}>
            <h2 className={styles.title}>
              {transactionStatus === 'processing'
                ? 'Waiting for confirmation'
                : transactionStatus === 'complete'
                ? 'Success'
                : 'Error'}
            </h2>
            <h3 className={styles.subTitle}>
              {transactionStatus === 'processing'
                ? `Harvesting ${data} TEDY`
                : transactionStatus === 'complete'
                ? 'Complete Transaction'
                : 'Transaction rejected'}
            </h3>
            <p className={styles.text}>
              {transactionStatus === 'processing'
                ? `Confirm this transaction in your wallet`
                : transactionStatus === 'complete'
                ? 'TEDY will be sent to your Cardano wallet'
                : 'Try again later'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
