import styles from './OperationHistory.module.less';

export default function TableLoadingHistory() {
  const skeletonData = Array(7)
    .fill(null)
    .map((_, index) => ({
      _DB_id: index,
    }));
  return (
    <section className={styles.transactionsTable}>
      <div className={styles.thead} />
      <div className={`${styles.tbody} ${styles.loading}`}>
        {skeletonData.map((fund) => (
          <div className={styles.tbodyContent} key={fund._DB_id} />
        ))}
      </div>
    </section>
  );
}
