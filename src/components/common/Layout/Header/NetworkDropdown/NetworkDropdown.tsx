import { useState } from 'react';

import {
  changeSelectedNetwork,
  useSelectedNetwork,
  visibleNetworks,
} from '../../../../../gateway/common/network';
import { CHEVRON_DOWN } from '../../../../../utils/images';
import styles from './NetworkDropdown.module.less';

export default function NetworkDropdown() {
  const [selectedNetwork] = useSelectedNetwork();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickMenu = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  return (
    <>
      <section className={styles.dropdownSelector} onClick={handleClickMenu}>
        <img src={selectedNetwork.networkAsset.icon} alt="icon-asset" />
        <svg
          width="15"
          height="15"
          className={`${styles.icon} ${isOpen ? styles.open : ''}`}
        >
          <use href={CHEVRON_DOWN} />
        </svg>
        {isOpen && (
          <article className={styles.dropdownMenu}>
            <h2 className={styles.titleMenu}>Select Network</h2>
            {visibleNetworks.map((network) => (
              <div
                className={`${styles.itemMenu} ${
                  selectedNetwork.name === network.name ? styles.active : ''
                }`}
                key={network.name}
                onClick={() => {
                  changeSelectedNetwork(network);
                  setIsOpen(false);
                }}
              >
                <img src={network.networkAsset.icon} alt="icon-asset" />
                <p className={styles.itemName}>{network.label}</p>
                {selectedNetwork.name === network.name && (
                  <div className={styles.iconCheck} />
                )}
              </div>
            ))}
          </article>
        )}
      </section>
    </>
  );
}
