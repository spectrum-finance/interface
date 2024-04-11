import { useEffect, useRef, useState } from 'react';

import { CHEVRON_DOWN, COIN } from '../../../../../utils/images';
import styles from './Rewards.module.less';

interface RewardsProps {
  width: number;
  data: number;
  isLoading: boolean;
}

export default function Rewards(props: RewardsProps) {
  const { width, data, isLoading } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (width > 1040) {
    return (
      <div className={styles.groupRewards}>
        <div className={styles.rewards}>
          <h2 className={styles.titleRewards}>Farming Rewards:</h2>
          <div className={styles.value}>
            {isLoading ? <div className={styles.loading} /> : data} TEDY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rewardsMobile} ref={dropdownRef}>
      <div className={styles.groupRewards} onClick={toggleDropdown}>
        <div className={styles.groupIcons}>
          <svg width="24" height="24" className={styles.icon}>
            <use href={COIN} />
          </svg>
          <svg
            width="16"
            height="16"
            className={`${styles.icon} ${isOpen ? styles.open : ''}`}
          >
            <use href={CHEVRON_DOWN} />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className={styles.dropdwonContent}>
          <div className={styles.rewards}>
            <h2 className={styles.titleRewards}>Farming Rewards:</h2>
            <div className={styles.value}>
              {isLoading ? <div className={styles.loading} /> : data} TEDY
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
