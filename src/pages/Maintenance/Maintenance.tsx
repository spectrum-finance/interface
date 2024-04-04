import styles from './Maintenance.module.less';

export default function Maintenance() {
  return (
    <div className={styles.maintenanceContainer}>
      <h1 className={styles.title}>Swap in Maintenance.</h1>
      <img
        src="/img/logo/teddyMaintenance.png"
        alt="tedy-maintenance"
        className={styles.image}
      />
    </div>
  );
}
