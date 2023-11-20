import styles from './Card.module.less';

interface CardProps {
  header: string;
  value: string;
}

export default function Card(props: CardProps) {
  const { header, value } = props;

  return (
    <div className={styles.card}>
      <article className={styles.headerCard}>
        <h3 className={styles.titleCard}>{header}</h3>
      </article>
      <article className={styles.contentCard}>
        <p
          className={`${styles.value} ${
            header === 'Deposit Ratio' ? styles.deposit : ''
          }`}
        >
          {value}
        </p>
      </article>
    </div>
  );
}
