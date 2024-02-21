import { useEffect, useState } from 'react';

interface FetchRewardsResponse {
  data: number | null;
  isLoading: boolean;
  error: string | null;
}

const useFetchRewards = (address: string): FetchRewardsResponse => {
  const [data, setData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://3010-medieval-dinosaur-ql5zvj.us1.demeter.run/data/${address}`,
        );
        if (res.ok) {
          const jsonData = await res.json();
          setData(Number(jsonData[0].sum) / 1e6);
        } else {
          setError('error fetch');
        }
      } catch (error) {
        setError('error get fetch');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [address]);
  return { data, isLoading, error };
};

export default useFetchRewards;
