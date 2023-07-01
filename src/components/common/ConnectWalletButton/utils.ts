export const isVesprWallet = (): boolean => {
  // @ts-ignore
  if (window.cardano.vespr && window.cardano.vespr.experimental) {
    // @ts-ignore
    return window.cardano.vespr.experimental.vespr_compat();
  }

  return false;
};
