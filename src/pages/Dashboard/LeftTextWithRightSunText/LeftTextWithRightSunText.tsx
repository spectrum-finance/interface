import BrightSun from '../../../assets/icons/icon-white-sun.svg';
import styles from './LeftTextWithRightSunText.module.less';

type LeftTextWithRightSunTextProps = {
  left: {
    title: string;
  };
  right: {
    title: string;
    subTitle: string;
  };
};

export const LeftTextWithRightSunText = ({
  left,
  right,
}: LeftTextWithRightSunTextProps) => {
  return (
    <div className={styles.topLeftRightComponentContainer}>
      <div className={styles.title}>{left.title}</div>

      <div className={styles.rightSection}>
        <img src={BrightSun} alt="Bright sun" />
        <div>
          <div>{right.title}</div>
          <div className={styles.subTitle}>{right.subTitle}</div>
        </div>
      </div>
    </div>
  );
};
