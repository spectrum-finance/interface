import { useState } from 'react';

import { TOKEN_TEDY } from '../../../utils/images';
import { TimeRangePicker, TimeType } from '../TimeRangePicker';
import { CoinCard } from './CoinCard/CoinCard';
import styles from './MarketMoversList.module.less';

export const MarketMoversList = () => {
  const [selectedTime, setSelectedTime] = useState<TimeType>('1w');
  return (
    <div className={styles.container}>
      <TimeRangePicker
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <div className={styles.listContainer}>
        <div className={styles.title}>Market Movers</div>
        <div className={styles.coinCards}>
          {Array.from({ length: 9 }).map((_, index) => (
            <CoinCard
              key={index}
              imgSrc={TOKEN_TEDY}
              left={{ title: 'TEDY', subTitle: 'TeddySwap' }}
              right={{ title: '$0.12', subTitle: '+$0.012 (+12.34%)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
