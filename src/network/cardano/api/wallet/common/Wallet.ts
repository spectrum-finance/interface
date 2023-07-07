import {
  decodeWasmUtxo,
  decodeWasmValue,
  HexString,
  Prover,
  Value,
} from '@spectrumlabs/cardano-dex-sdk';
import { RawTx } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/tx';
import { TxOut } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';

import { Address } from '../../../../../common/types';
import { Unpacked } from '../../../../../common/utils/unpacked';
import { selectUtxos } from './BoxSelector';

// Todo: Extract to sdk
export interface Submitter {
  readonly submit: (tx: RawTx) => Promise<HexString>;
}

export interface WalletData {
  readonly connector: CardanoBridge.ConnectorAPI;
  readonly id: string;

  readonly assertContext: <
    T extends (context: CardanoBridge.ConnectorContextApi) => any,
  >(
    callback: T,
  ) => Promise<Unpacked<ReturnType<T>>>;
  readonly getUsedAddresses: () => Promise<Address[]>;
  readonly getUnusedAddresses: () => Promise<Address[]>;
  readonly getAddresses: () => Promise<Address[]>;
  readonly getChangeAddress: () => Promise<Address>;

  readonly getBalance: () => Promise<Value>;
  readonly getUtxos: (
    amount?: Value,
    excludedInputs?: TxOut[],
  ) => Promise<TxOut[]>;
  readonly getCollateral: (amount?: bigint) => Promise<TxOut[]>;
}

export type Wallet<T extends object = object> = Prover &
  Submitter &
  WalletData &
  T;

export interface WalletExtendParams {
  readonly id: string;
  readonly getConnector: () => CardanoBridge.ConnectorAPI;
  readonly getUsedAddresses?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address[]>;
  readonly getUnusedAddresses?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address[]>;
  readonly getChangeAddress?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address>;
  readonly getBalance?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Value>;
  readonly getUtxos?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<TxOut[]>;
  readonly getCollateral?: (
    ctx: CardanoBridge.ConnectorContextApi,
    amount?: bigint,
  ) => Promise<TxOut[]>;
  readonly submit?: (
    ctx: CardanoBridge.ConnectorContextApi,
    tx: RawTx,
  ) => Promise<HexString>;
  readonly sign?: (
    ctx: CardanoBridge.ConnectorContextApi,
    tx: RawTx,
    partialSign?: boolean,
  ) => Promise<HexString>;
}

export const createWallet = <
  AdditionalData extends object | undefined = undefined,
>(
  params: AdditionalData extends object
    ? WalletExtendParams & AdditionalData
    : WalletExtendParams,
): AdditionalData extends object ? Wallet<AdditionalData> : Wallet => {
  const connector = params.getConnector();
  let contextPromise: Promise<CardanoBridge.ConnectorContextApi>;

  //@ts-ignore
  const assertContext = <
    T extends (context: CardanoBridge.ConnectorContextApi) => any,
  >(
    callback: T,
  ): Promise<Unpacked<ReturnType<T>>> => {
    if (!connector) {
      return Promise.reject(
        new Error(`connector with id ${params.id} not found`),
      );
    }
    if (!contextPromise) {
      contextPromise = connector.enable();
    }
    return contextPromise.then((context) => callback(context));
  };

  const getUsedAddresses = (): Promise<Address[]> => {
    return assertContext((context) => {
      if (params?.getUsedAddresses) {
        return params.getUsedAddresses(context);
      }
      return context.getUsedAddresses();
    });
  };

  const getUnusedAddresses = (): Promise<Address[]> => {
    return assertContext((context) => {
      if (params?.getUnusedAddresses) {
        return params.getUnusedAddresses(context);
      }
      return context.getUnusedAddresses();
    });
  };

  const getChangeAddress = (): Promise<Address> => {
    return assertContext((context) => {
      if (params?.getChangeAddress) {
        return params.getChangeAddress(context);
      }
      return context.getChangeAddress();
    });
  };

  const getAddresses = (): Promise<Address[]> => {
    return Promise.all([getUnusedAddresses(), getUsedAddresses()]).then(
      ([unusedAddresses, usedAddresses]) => [
        ...unusedAddresses,
        ...usedAddresses,
      ],
    );
  };

  const getBalance = (): Promise<Value> => {
    return assertContext((context) => {
      if (params?.getBalance) {
        return params.getBalance(context);
      }
      return context
        .getBalance()
        .then((rawBalance) =>
          decodeWasmValue(rawBalance, RustModule.CardanoWasm),
        );
    });
  };

  const getUtxos = (
    amount?: Value,
    excludedInputs?: TxOut[],
  ): Promise<TxOut[]> => {
    return assertContext((context) => {
      if (params?.getUtxos) {
        return params.getUtxos(context);
      }
      return context
        .getUtxos()
        .then(
          (rawUtxos) =>
            rawUtxos?.map((hex) =>
              decodeWasmUtxo(hex, RustModule.CardanoWasm),
            ) || [],
        );
    }).then((utxos) =>
      amount ? selectUtxos(utxos, amount, excludedInputs) : utxos,
    );
  };

  const getCollateral = (amount?: bigint): Promise<TxOut[]> => {
    return assertContext((context) => {
      const argument = amount
        ? ({
            amount: RustModule._wasm?.BigNum.from_str(
              amount.toString(),
            ).to_hex(),
          } as any)
        : undefined;

      if (params?.getCollateral) {
        return params.getCollateral(context, amount);
      }

      if (!context.getCollateral && !context.experimental.getCollateral) {
        return [];
      }

      const collateralPromise = context.getCollateral
        ? context.getCollateral(argument)
        : context.experimental.getCollateral(argument);

      return collateralPromise.then(
        (rawUtxos) =>
          rawUtxos?.map((hex) => decodeWasmUtxo(hex, RustModule.CardanoWasm)) ||
          [],
      );
    });
  };

  const submit = (tx: RawTx): Promise<HexString> => {
    return assertContext((context) => {
      if (params?.submit) {
        return params.submit(context, tx);
      }
      return context.submitTx(tx);
    });
  };

  const sign = (tx: RawTx, partialSign?: boolean): Promise<HexString> => {
    return assertContext((context) => {
      if (params?.sign) {
        return params.sign(context, tx, partialSign);
      }
      return context.signTx(tx, partialSign);
    });
  };

  return {
    ...(params as any),

    id: params.id,
    connector,
    assertContext,

    getAddresses,
    getUnusedAddresses,
    getUsedAddresses,
    getChangeAddress,

    getBalance,
    getUtxos,
    getCollateral,

    submit,
    sign,
  };
};
