import { useEffect, useState } from 'react';

interface FetchMarketResponse {
  dataMarket: any | null;
  loadedMarket: boolean;
  errorMarket: string | null;
}

const useFetchMarketMovers = (): FetchMarketResponse => {
  const [dataMarket, setDataMarket] = useState<any | null>(null);
  const [loadedMarket, setLoadedMarket] = useState<boolean>(false);
  const [errorMarket, setErrorMarket] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://3010-medieval-dinosaur-ql5zvj.us1.demeter.run/teddyswap/market-movers`,
      );
      if (res.ok) {
        const jsonData = await res.json();
        setDataMarket(jsonData);
      } else {
        setErrorMarket('error fetch');
      }
    } catch (error) {
      setErrorMarket('error get fetch');
    }
    setLoadedMarket(true);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    dataMarket,
    loadedMarket,
    errorMarket,
  };
};

export default useFetchMarketMovers;
