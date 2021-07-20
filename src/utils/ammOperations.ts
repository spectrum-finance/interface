import { OpStatus } from 'ergo-dex-sdk/build/main/amm/models/ammOperation';

import { ammOrderRefunds } from './ammOrderRefund';
import { userInputToFractions } from './walletMath';
import { numOfErgDecimals } from '../constants/erg';
import { explorer } from './explorer';
import { DefaultBoxSelector } from 'ergo-dex-sdk/build/module/ergo';
import { BoxSelection } from 'ergo-dex-sdk/build/module/ergo/wallet/entities/boxSelection';
import { Address, TxId } from 'ergo-dex-sdk/build/main/ergo';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';

const validRefundStatuses = ['pending', 'submitted'];

export const isRefundableOperation = (status: OpStatus): boolean =>
  validRefundStatuses.indexOf(status) !== -1;

export const refund = async (
  txId: TxId,
  minerFee: string,
  utxos: ErgoBox[],
  address: Address,
): Promise<void> => {
  const minerFeeNErgs = userInputToFractions(minerFee, numOfErgDecimals);
  const networkContext = await explorer.getNetworkContext();

  const params = {
    txId,
    recipientAddress: address,
  };

  const inputs = DefaultBoxSelector.select(utxos, {
    nErgs: minerFeeNErgs,
    assets: [],
  });

  if (inputs instanceof BoxSelection) {
    const txContext = {
      inputs,
      changeAddress: address,
      selfAddress: address,
      feeNErgs: minerFeeNErgs,
      network: networkContext,
    };

    try {
      await ammOrderRefunds.refund(params, txContext);
    } catch (err) {
      console.error(err);
    }
  }
};
