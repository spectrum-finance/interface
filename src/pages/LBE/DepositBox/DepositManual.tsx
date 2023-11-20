import QRCode from 'react-qr-code';

import { ICON_COPY } from '../../../utils/images';
import styles from './DepositManual.module.less';
import useDeposit from './useDeposit';

export default function DepositManual() {
  const { addressDeposit, isCopied, handleCopyClick } = useDeposit();

  return (
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
  );
}
