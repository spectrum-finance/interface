import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

import { ICON_COPY } from '../../../utils/images';
import styles from './DepositManual.module.less';
import useDeposit from './useDeposit';

interface DepositManualProps {
  startTime: number;
  endTime: number;
}

export default function DepositManual({
  startTime,
  endTime,
}: DepositManualProps) {
  const { addressDeposit, isCopied, handleCopyClick } = useDeposit();

  const [isDepositAllowed, setIsDepositAllowed] = useState(false);

  const checkDepositWindow = () => {
    const now = new Date().getTime();
    return now >= startTime * 1000 && now <= endTime * 1000;
  };

  useEffect(() => {
    // Check the deposit window initially
    setIsDepositAllowed(checkDepositWindow());

    // Check periodically (e.g., every second)
    const interval = setInterval(() => {
      setIsDepositAllowed(checkDepositWindow());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return isDepositAllowed ? (
    <section className={styles.boxDepositManual}>
      <h2 className={styles.boxTitle}>Deposit ADA (manually)</h2>
      <div className={styles.inputCard}>
        <p className={styles.titleInput}>Deposit Address</p>
        <div className={styles.adressContent} onClick={handleCopyClick}>
          <img src={ICON_COPY} alt="copy" className={styles.icon} />
          <p className={styles.address}>{addressDeposit}</p>
          {isCopied && <p className={styles.copied}>Copied</p>}
        </div>
      </div>
      <div className={styles.qrContainer}>
        <div
          style={{
            height: 'auto',
            margin: 'auto',
            width: '100%',
            padding: '10px',
          }}
        >
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={addressDeposit}
            viewBox={`0 0 256 256`}
            bgColor={`#FFFFFF`}
          />
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
}
