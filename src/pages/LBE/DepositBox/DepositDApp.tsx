import { Modal } from '@ergolabs/ui-kit';

import { ChooseWalletModal } from '../../../components/common/ConnectWalletButton/ChooseWalletModal/ChooseWalletModal';
import { ARROW_DOWN, TOKEN_ADA, TOKEN_TEDY } from '../../../utils/images';
import styles from './DepositDApp.module.less';
import useDeposit from './useDeposit';

export default function DepositDApp() {
  const {
    handleKeyDown,
    handleValueChange,
    valueAdaInput,
    handleWheel,
    valueTedyInput,
    handleClickMax,
    isWalletConnected,
    isValidInput,
    handleClickDeposit,
  } = useDeposit();

  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <section className={styles.boxDepositWallet}>
      <h2 className={styles.boxTitle}>Deposit ADA (via dApp wallet)</h2>
      <div className={styles.inputCard}>
        <p className={styles.titleInput}>Deposit Amount</p>
        <div className={styles.inputContent}>
          <input
            type="number"
            className={styles.input}
            placeholder="0.0"
            value={valueAdaInput}
            onKeyDown={handleKeyDown}
            onChange={handleValueChange}
            onWheel={handleWheel}
          />
          <div className={styles.tokenGroup}>
            <img
              src={TOKEN_ADA}
              alt="token-ada"
              className={styles.tokenImage}
            />
            <p className={styles.tokenName}>ADA</p>
          </div>
          <div className={styles.mask} />
          {isWalletConnected && (
            <p className={styles.selectMax} onClick={handleClickMax}>
              Max
            </p>
          )}
        </div>
      </div>
      <div className={styles.iconContainer}>
        <svg width="34" height="34" className={styles.icon}>
          <use href={ARROW_DOWN} />
        </svg>
      </div>
      <div className={styles.inputCard}>
        <p className={styles.titleInput}>TEDY Amount (estimated)</p>
        <div className={`${styles.inputContent} ${styles.resultContent}`}>
          <p className={styles.result}>{valueTedyInput}</p>
          <div className={styles.tokenGroup}>
            <img
              src={TOKEN_TEDY}
              alt="token-tedy"
              className={styles.tokenImage}
            />
            <p className={styles.tokenName}>TEDY</p>
          </div>
          <div className={styles.mask} />
        </div>
      </div>
      {isWalletConnected ? (
        isValidInput.valid ? (
          <button className={styles.btnDeposit} onClick={handleClickDeposit}>
            Deposit
          </button>
        ) : (
          <button className={styles.btnDeposit} disabled>
            {isValidInput.text}
          </button>
        )
      ) : (
        <button className={styles.btnDeposit} onClick={openChooseWalletModal}>
          Connect Wallet
        </button>
      )}
    </section>
  );
}
