import { Tooltip } from '@ergolabs/ui-kit';
import { useEffect, useRef, useState } from 'react';

import { CHEVRON_DOWN, COIN, EXCLAMATION } from '../../../../../utils/images';
import styles from './Rewards.module.less';

interface RewardsProps {
  width: number;
}

export default function Rewards(props: RewardsProps) {
  const { width } = props;
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
          <p className={styles.value}>2311.445 TEDY</p>
        </div>
        <div className={styles.rewards}>
          <div className={styles.titleGroup}>
            <Tooltip
              title="Rewards available after each epoch"
              maxWidth={200}
              placement="topLeft"
              width="100%"
            >
              <svg width="14" height="14" className={styles.icon}>
                <use href={EXCLAMATION} />
              </svg>
              <h2 className={styles.titleRewards}>Claimable Now:</h2>
            </Tooltip>
          </div>

          <p className={styles.value}>2311.445 TEDY</p>
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
            <p className={styles.value}>2311.445 TEDY</p>
          </div>
          <div className={styles.rewards}>
            <div className={styles.titleGroup}>
              <Tooltip
                title="Rewards available after each epoch"
                maxWidth={200}
                placement="topLeft"
                width="100%"
              >
                <svg width="14" height="14" className={styles.icon}>
                  <use href={EXCLAMATION} />
                </svg>
                <h2 className={styles.titleRewards}>Claimable Now:</h2>
              </Tooltip>
            </div>

            <p className={styles.value}>2311.445 TEDY</p>
          </div>
        </div>
      )}
    </div>
  );
}
