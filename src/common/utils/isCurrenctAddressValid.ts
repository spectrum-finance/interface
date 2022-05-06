import { Address } from '@ergolabs/ergo-sdk';

export const isCurrentAddressValid = (
  address: Address | undefined,
  addresses: Address[],
): boolean => !!address && addresses.includes(address);
