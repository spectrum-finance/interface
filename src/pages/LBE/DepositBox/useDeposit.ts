import { useState } from 'react';

const useDeposit = () => {
  const addressDeposit =
    'addr_test1qp3rdw6z8j02mpdw4exp2t4yvzlzlq8qcnp9nrl6knc3eh9glz4js4pan5rq2nyacvy0gmu2ka46865k08yf6zmqsncs49vsu3';

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(addressDeposit);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error('error', err);
      setIsCopied(false);
    }
  };

  return { addressDeposit, isCopied, handleCopyClick };
};

export default useDeposit;
