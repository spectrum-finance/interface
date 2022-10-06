import { Currency } from '../../../../common/models/Currency';

export const ergoPayMessageManager = {
  swap(
    from: Currency,
    to: Currency,
    feeMin: Currency,
    feeMax: Currency,
  ): string {
    return `
      Spectrum
      Operation: Swap
      ${from.toCurrencyString()} → ${to.toCurrencyString()}
      Total fees: ${feeMin.toString()} - ${feeMax.toString()} ${
      feeMin.asset.name
    }
    `;
  },
};
