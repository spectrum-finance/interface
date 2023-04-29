export const isProductionEnv = (): boolean =>
  import.meta.env.NODE_ENV === 'production';
