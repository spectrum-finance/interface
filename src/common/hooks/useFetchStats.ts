import { useEffect, useState } from 'react';

interface FetchStatsResponse {
  dataStats: any | null;
  loadedStats: boolean;
  errorStats: string | null;
}

const useFetchStats = (): FetchStatsResponse => {
  const [dataStats, setDataStats] = useState<any | null>(null);
  const [loadedStats, setLoadedStats] = useState<boolean>(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://3010-medieval-dinosaur-ql5zvj.us1.demeter.run/teddyswap/stats/limited`,
      );
      if (res.ok) {
        const jsonData = await res.json();
        setDataStats(jsonData);
      } else {
        setErrorStats('error fetch');
      }
    } catch (error) {
      setErrorStats('error get fetch');
    }
    setLoadedStats(true);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    dataStats,
    loadedStats,
    errorStats,
  };
};

export default useFetchStats;
