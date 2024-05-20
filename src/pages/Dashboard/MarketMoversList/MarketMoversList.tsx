import useFetchMarketMovers from '../../../common/hooks/useFetchMarketMovers';
import { CoinCard } from './CoinCard/CoinCard';
import styles from './MarketMoversList.module.less';

export const MarketMoversList = () => {
  const { dataMarket, loadedMarket } = useFetchMarketMovers();

  if (loadedMarket) {
    console.log(dataMarket);
  }

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        <div className={styles.title}>Market Movers</div>
        <div className={styles.coinCards}>
          {!loadedMarket
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={styles.loadingMarket} />
              ))
            : dataMarket.map((coin: any) => (
                <CoinCard
                  key={coin.id}
                  base={{ name: coin.base_name, amount: coin.base_amount }}
                  quote={{ name: coin.quote_name, amount: coin.actual_quote }}
                  operation={coin.operation}
                  address={coin.addressWallet}
                  date={
                    new Date(coin.execution_timestamp * 1000)
                      .toISOString()
                      .split('T')[0]
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};
