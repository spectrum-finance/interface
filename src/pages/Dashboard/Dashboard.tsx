import { AreaChart } from './AreaChart/AreaChart';
import { BatchersCard } from './BatchersCard/BatchersCard';
import { CoinDetailsCard } from './CoinDetailsCard/CoinDetailsCard';
import styles from './Dashboard.module.less';
import { MarketMoversList } from './MarketMoversList/MarketMoversList';

const Dashboard = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.leftSideContainer}>
          <div className={styles.topChartsContainer}>
            <div className={styles.chart}>
              <AreaChart
                chartProps={{ height: '232px' }}
                topLeftComponentData={{
                  title: 'Volume',
                  subTitle: '₳6,363,639.46',
                  performanceSummary: '+₳544.03 (+2.03%) this week',
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                verticalData={{
                  label: 'Volume',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
            <div className={styles.chart}>
              <AreaChart
                chartProps={{ height: '232px' }}
                topLeftComponentData={{
                  title: 'TVL ',
                  subTitle: '₳63,514,216.46',
                  performanceSummary: '+₳54,360.03 (+2.03%) today',
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                verticalData={{
                  label: 'TVL',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
          </div>
          <div className={styles.bottomChartsContainer}>
            <div className={styles.bottomChart}>
              <AreaChart
                topLeftAndRightComponent={{
                  left: {
                    title: 'Treasurey',
                  },
                  right: {
                    title: '₳193,930.12',
                    subTitle: 'Treasury Value',
                  },
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                chartProps={{ height: '150px' }}
                verticalData={{
                  label: 'Treasurey',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
            <div className={styles.bottomChart}>
              <AreaChart
                topLeftAndRightComponent={{
                  left: {
                    title: 'Revenue',
                  },
                  right: {
                    title: '₳203,930.12',
                    subTitle: 'Buybacks this week',
                  },
                }}
                horizontalLabels={['09/22', '09/23', '09/24', '09/25', '09/26']}
                chartProps={{ height: '150px' }}
                verticalData={{
                  label: 'Revenue',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
          </div>
          <div className={styles.lastCardsContainer}>
            <BatchersCard />
            <CoinDetailsCard />
          </div>
        </div>
        <MarketMoversList />
      </div>
    </div>
  );
};

export default Dashboard;
