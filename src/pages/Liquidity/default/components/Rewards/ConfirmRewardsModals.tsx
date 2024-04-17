import { TOKEN_TEDY, X } from '../../../../../utils/images';
import styles from './ConfirmRewards.module.less';

interface ConfirmRewardsModalProps {
  data: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmRewardsModals(props: ConfirmRewardsModalProps) {
  const { data, onClose, onConfirm } = props;

  return (
    <section className={styles.modal}>
      <div className={styles.main}>
        <div className={styles.popUp}>
          <h2 className={styles.title}>Confirm Harvest</h2>
          <svg width="36" height="36" className={styles.icon} onClick={onClose}>
            <use href={X} />
          </svg>

          <div className={styles.head}>
            <h3 className={styles.value}>{data}</h3>
            <div className={styles.token}>
              <img src={TOKEN_TEDY} alt="logo-tedy" className={styles.logo} />
              <h5 className={styles.tokenName}>TEDY</h5>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.btnConfirm} onClick={onConfirm}>
              Confirm Harvest
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
