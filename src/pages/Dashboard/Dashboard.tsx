import { AreaChart } from './AreaChart/AreaChart';
import styles from './Dashboard.module.less';
import { RightSideCoinList } from './RightSideCoinList';

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
                // chartProps={{ height: 100 }}
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
                // chartProps={{ height: 170 }}
                horizontalLabels={['09/22', '09/23', '09/24', '09/25', '09/26']}
              />
            </div>
          </div>
          <div className={styles.lastCardsContainer}>
            <div className={styles.bottomChart}>123</div>
            <div className={styles.bottomChart}>123</div>
          </div>
        </div>
        <RightSideCoinList />
      </div>
    </div>
  );
};

export default Dashboard;
