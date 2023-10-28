import {
  AdaAssetName,
  AdaAssetNameHex,
  AdaPolicyId,
  AssetEntry,
  Value,
} from '@teddyswap/cardano-dex-sdk';
import { TxOut } from '@teddyswap/cardano-dex-sdk/build/main/cardano/entities/txOut';

interface UtxosByAsset {
  required: AssetEntry;
  utxos: TxOut[];
}

interface SelectedUtxos {
  readonly utxos: { [key: string]: TxOut };
  readonly required: { [key: string]: AssetEntry };
  readonly available: { [key: string]: AssetEntry };
}

const isAssetEquals = (
  assetA: AssetEntry,
): ((assetB: AssetEntry) => boolean) => {
  return (assetB: AssetEntry): boolean =>
    assetA.name === assetB.name && assetA.policyId === assetB.policyId;
};

const getAssetFromBox = (
  txOut: TxOut,
  asset: AssetEntry,
): AssetEntry | undefined => {
  return txOut.value.find(isAssetEquals(asset));
};

const getAssetFromBoxStrict = (txOut: TxOut, asset: AssetEntry): AssetEntry => {
  const result = txOut.value.find(isAssetEquals(asset));

  if (!result) {
    throw new Error('asset not found');
  }
  return result;
};

const isAdaAsset = (asset: AssetEntry): boolean =>
  isAssetEquals(asset)({
    name: AdaAssetName,
    policyId: AdaPolicyId,
    nameHex: AdaAssetNameHex,
    quantity: 0n,
  });

const isNonAdaAsset = (asset: AssetEntry): boolean => !isAdaAsset(asset);

const getSortedUtxosByAsset = (
  utxos: TxOut[],
  coin: AssetEntry,
): UtxosByAsset => ({
  required: coin,
  utxos: utxos
    .filter((utxo) => getAssetFromBox(utxo, coin))
    .sort((utxoA, utxoB) => {
      const assetA = getAssetFromBoxStrict(utxoA, coin);
      const assetB = getAssetFromBoxStrict(utxoB, coin);

      if (utxoA.value.length === utxoB.value.length) {
        return Number(assetB.quantity - assetA.quantity);
      }
      return utxoA.value.length - utxoB.value.length;
    }),
});

const getUtxoId = (utxo: TxOut): string => `${utxo.txHash}.${utxo.index}`;

const getAssetEntryId = (asset: AssetEntry): string =>
  `${asset.policyId}.${asset.name}`;

const selectUtxosByAsset = (
  selectedUtxos: SelectedUtxos,
  utxosByAsset: UtxosByAsset,
): SelectedUtxos => {
  const assetEntryId = getAssetEntryId(utxosByAsset.required);
  const required: AssetEntry = utxosByAsset.required;

  for (const utxo of utxosByAsset.utxos) {
    const utxoId = getUtxoId(utxo);

    if (selectedUtxos.utxos[utxoId]) {
      continue;
    }

    const available = selectedUtxos.available[assetEntryId]?.quantity || 0n;
    if (available >= required.quantity) {
      break;
    }

    selectedUtxos.utxos[utxoId] = utxo;
    utxo.value.forEach((asset) => {
      const key = getAssetEntryId(asset);

      if (selectedUtxos.available[key]) {
        selectedUtxos.available[key] = {
          ...selectedUtxos.available[key],
          quantity: selectedUtxos.available[key].quantity + asset.quantity,
        };
      } else {
        selectedUtxos.available[key] = { ...asset };
      }
    });
  }

  return selectedUtxos;
};

export const selectUtxos = (
  rawUtxos: TxOut[],
  amount: Value,
  excludedInputs: TxOut[] = [],
): TxOut[] => {
  const nonAdaCoins = amount.filter(isNonAdaAsset);
  const adaCoin = amount.find(isAdaAsset)!;
  const utxos = rawUtxos.filter(
    (ru) => !excludedInputs.some((ei) => getUtxoId(ru) === getUtxoId(ei)),
  );

  const sortedUtxosByNonAdaCoins = nonAdaCoins.map((coin) =>
    getSortedUtxosByAsset(utxos, coin),
  );
  const sortedUtxosByAda = getSortedUtxosByAsset(utxos, adaCoin);

  let selectedUtxos: SelectedUtxos =
    sortedUtxosByNonAdaCoins.reduce<SelectedUtxos>(selectUtxosByAsset, {
      available: {},
      utxos: {},
      required: amount.reduce(
        (acc, item) => ({
          ...acc,
          [getAssetEntryId(item)]: item,
        }),
        {},
      ),
    });
  selectedUtxos = selectUtxosByAsset(selectedUtxos, sortedUtxosByAda);

  const availableHasAllRequiredAssets = Object.values(
    selectedUtxos.required,
  ).every((asset) => {
    const assetId = getAssetEntryId(asset);

    return (
      selectedUtxos.available[assetId] &&
      selectedUtxos.available[assetId].quantity >= asset.quantity
    );
  });

  if (availableHasAllRequiredAssets) {
    return Object.values(selectedUtxos.utxos);
  } else {
    throw new Error('insufficient funds');
  }
};
