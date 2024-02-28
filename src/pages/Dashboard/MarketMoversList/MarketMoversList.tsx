import { useState } from 'react';

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
              imgSrc={
                'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29pbnxlbnwwfHwwfHx8MA%3D%3D'
              }
              left={{ title: 'TEDY', subTitle: 'TeddySwap' }}
              right={{ title: '$0.12', subTitle: '+$0.012 (+12.34%)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
