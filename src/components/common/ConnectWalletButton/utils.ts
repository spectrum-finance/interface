export const isVesprWallet = (): boolean => {
  // @ts-ignore
  if (window.cardano.vespr && window.cardano.vespr.experimental) {
    console.log(
      '>> vespr test',
      // @ts-ignore
      window.cardano.vespr.experimental.vespr_compat(),
    );
    // @ts-ignore
    return window.cardano.vespr.experimental.vespr_compat();
  }

  return false;
};
