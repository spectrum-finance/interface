import { OpStatus } from 'ergo-dex-sdk/build/main/amm/models/ammOperation';

import { ammOrderRefunds } from './ammOrderRefund';
import { inputToFractions } from './walletMath';
import { ERG_DECIMALS } from '../constants/erg';
import { explorer } from './explorer';
import { DefaultBoxSelector, ErgoTx } from 'ergo-dex-sdk/build/module/ergo';
import { BoxSelection } from 'ergo-dex-sdk/build/module/ergo/wallet/entities/boxSelection';
import { Address, TxId } from 'ergo-dex-sdk/build/main/ergo';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';

interface RefundParams {
  txId: TxId;
  address: Address;
  minerFee: string;
}

const validRefundStatuses = ['pending', 'submitted'];

export const isRefundableOperation = (status: OpStatus): boolean =>
  validRefundStatuses.indexOf(status) !== -1;

export const refund = async (
  utxos: ErgoBox[],
  refundParams: RefundParams,
): Promise<ErgoTx> => {
  const { txId, minerFee, address } = refundParams;
  const minerFeeNErgs = inputToFractions(minerFee, ERG_DECIMALS);
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

    return ammOrderRefunds.refund(params, txContext);
  } else {
    return Promise.reject(inputs.message);
  }
};
