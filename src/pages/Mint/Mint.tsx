import { Flex } from '@ergolabs/ui-kit';
import { useState } from 'react';

import switchArrow from '../../assets/icons/arrows.png';
import Ada from '../../assets/icons/tokens/token-ada.svg';
import UAda from '../../assets/icons/tokens/token-uada.svg';
import { Page } from '../../components/Page/Page';
import { SwitchButton } from '../Swap/SwitchButton/SwitchButton';
import styles from './Mint.module.less';

export const Mint = () => {
  const [isSwitch, setIsSwitch] = useState<boolean>(false);

  const switchAssets = () => {
    setIsSwitch(!isSwitch);
  };

  return (
    <Page maxWidth={500} widgetBaseHeight={432}>
      <Flex col>
        <div className={styles.header}>
          <h2 className={styles.titleContainer}>Mint uADA</h2>
        </div>
        <Flex.Item marginBottom={1} marginTop={2}>
          <section className={styles.assetContainer}>
            <Flex width={'100%'} justify="space-between" align="center">
              <div>
                <div className={styles.title}>0</div>
                <div className={styles.subTitle}>$0.00 USD</div>
              </div>
              <Flex align="flex-end" direction="col">
                <Flex align="center" gap={3}>
                  <img width={33} height={33} src={Ada} alt="ADA" />
                  <div className={styles.title}>ADA</div>
                </Flex>
                <div className={styles.subTitle}>Balance: 0</div>
              </Flex>
            </Flex>
          </section>
        </Flex.Item>
      </Flex>
      <SwitchButton
        onClick={switchAssets}
        icon={<img src={switchArrow} alt="logoArrow" />}
        size="middle"
        isSwitch={isSwitch}
      />
      <Flex.Item marginBottom={1} marginTop={2}>
        <section className={styles.assetContainer}>
          <Flex width={'100%'} justify="space-between" align="center">
            <div>
              <div className={styles.title}>0</div>
              <div className={styles.subTitle}>$0.00 USD</div>
            </div>
            <Flex align="flex-end" direction="col">
              <Flex align="center" gap={3}>
                <img width={33} height={33} src={UAda} alt="uADA" />
                <div className={styles.title}>uADA</div>
              </Flex>
              {/* <div className={styles.subTitle}>Balance: 0</div> */}
            </Flex>
          </Flex>
        </section>
      </Flex.Item>
      <button className={styles.btnMint}>Mint</button>
    </Page>
  );
};
