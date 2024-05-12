import styles from './LoadingChart.module.less';

type LoadingChartProps = {
  title: string;
};

export default function LoadingChart(props: LoadingChartProps) {
  const { title } = props;

  return (
    <div className={styles.loadingChart}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.loadingValue}>
        <p className={styles.lineLoading} />
      </div>
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
      </div>
    </div>
  );
}
