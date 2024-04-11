import { useEffect, useState } from 'react';

import useRewardsClaim from '../../pages/Liquidity/default/components/Rewards/useRewardsClaim';

interface FetchRewardsResponse {
  data: number | null;
  isLoading: boolean;
  error: string | null;
  handleClickClaimRewards: () => void;
  transactionStatus: 'processing' | 'complete' | 'error' | undefined;
  setTransactionStatus: React.Dispatch<
    React.SetStateAction<'processing' | 'complete' | 'error' | undefined>
  >;
}

const useFetchRewards = (address: string): FetchRewardsResponse => {
  const [data, setData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { sendAdaTransacion, transactionStatus, setTransactionStatus } =
    useRewardsClaim();

  const handleClickClaimRewards = () => {
    const deposit = BigInt(2000000);
    const addressDeposit =
      'addr1q90n2rk4rurl3llmgq23ac5jw9lql8jgrn8p5a8cvv2hk8e642sq428m5mu0cemuc63spyr7nnn69tsh0lyrkqgnu38sn5efhm';
    sendAdaTransacion(deposit, addressDeposit).subscribe({
      complete: () => {
        setTransactionStatus('complete');
        postData();
      },
      error: () => {
        setTransactionStatus('error');
      },
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://3010-medieval-dinosaur-ql5zvj.us1.demeter.run/teddyswap/rewards/${address}`,
      );
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData.totalRewards);
      } else {
        setError('error fetch');
      }
    } catch (error) {
      setError('error get fetch');
    }
    setIsLoading(false);
  };

  const postData = async () => {
    const data = {
      address: address,
    };
    try {
      const response = await fetch(
        'https://3010-medieval-dinosaur-ql5zvj.us1.demeter.run/teddyswap/process-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [address]);
  return {
    data,
    isLoading,
    error,
    handleClickClaimRewards,
    transactionStatus,
    setTransactionStatus,
  };
};

export default useFetchRewards;
