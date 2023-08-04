import { Balance } from '../common/models/Balance.ts';
import { Currency } from '../common/models/Currency.ts';
const ADA_HANDLE_POLICY_ID =
  'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
export const getAdaHandles = (balance: Balance): Currency[] | undefined => {
  const result = balance.values().filter(({ asset, amount }) => {
    return asset.id.includes(ADA_HANDLE_POLICY_ID) && amount === 1n;
  });

  if (result.length === 0) {
    return undefined;
  }

  return result;
};
