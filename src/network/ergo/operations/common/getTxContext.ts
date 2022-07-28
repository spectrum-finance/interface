import { TransactionContext } from '@ergolabs/ergo-sdk';
import { Address } from '@ergolabs/ergo-sdk/build/main/entities/address';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { BoxSelection } from '@ergolabs/ergo-sdk/build/main/wallet/entities/boxSelection';

export const getTxContext = (
  inputs: BoxSelection,
  network: NetworkContext,
  address: Address,
  minerFee: bigint,
): TransactionContext => ({
  inputs,
  selfAddress: address,
  changeAddress: address,
  feeNErgs: minerFee,
  network,
});
