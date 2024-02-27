import { ElementType } from 'react';

import { ReactComponent as MilitaryTech } from '../../../assets/icons/icon-military-tech.svg';
import { ReactComponent as SunBlue } from '../../../assets/icons/icon-sun-blue.svg';
import { ReactComponent as WorldBlue } from '../../../assets/icons/icon-world-blue.svg';
import { LeftTextWithRightSunText } from '../LeftTextWithRightSunText/LeftTextWithRightSunText';
import styles from './BachersCard.module.less';

type SingleItemProps = {
  title: string;
  subTitle: string;
  icon: {
    element: ElementType;
    width: number;
    height: number;
  };
};

const SingleItem = ({ title, subTitle, icon }: SingleItemProps) => {
  const IconComponent = icon.element;
  return (
    <div className={styles.singleItem}>
      <IconComponent
        width={icon.width}
        className={styles.image}
        height={icon.height}
      />
      <div className={styles.rightSection}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
    </div>
  );
};

export const BatchersCard = () => {
  return (
    <div className={styles.batchersCard}>
      <LeftTextWithRightSunText
        left={{ title: 'Batchers' }}
        right={{ title: '₳203,930.12', subTitle: 'Distributed this week' }}
      />
      <div className={styles.bottomSection}>
        <div className={styles.itemsList}>
          <SingleItem
            title="₳3,303,930.12"
            subTitle="Distributed to Batchers"
            icon={{ element: SunBlue, height: 29, width: 29 }}
          />
          <SingleItem
            title="236"
            subTitle="Batchers Worldwide"
            icon={{ element: WorldBlue, height: 29, width: 29 }}
          />
          <SingleItem
            title="1st"
            subTitle="Open-Source batcher 
protocol on Cardano"
            icon={{ element: MilitaryTech, height: 36, width: 29 }}
          />
        </div>
        <div className={styles.btnList}>
          <button className={styles.btnPrimary}>Run a Batcher</button>
          <button className={styles.btnPrimary}>View Github</button>
          <button className={styles.btnPrimary}>Learn More</button>
        </div>
      </div>
    </div>
  );
};
