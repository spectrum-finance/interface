export const isProductionEnv = (): boolean =>
  import.meta.env.NODE_ENV === 'production';

export const getSentryEnv = (): string => {
  if (location.host === 'testnet.teddyswap.org') {
    return 'production';
  }
  if (location.host === 'testnet.teddyswap.org') {
    return 'test';
  }
  if (location.host === 'testnet.teddyswap.org') {
    return 'dev';
  }
  return 'local';
};
