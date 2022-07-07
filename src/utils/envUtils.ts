const DOMAIN_ENV_PROD = 'app';
const DOMAIN_ENV_TEST = 'test';
const DOMAIN_ENV_DEV = 'dev';

export const isProductionEnv =
  process.env.NODE_ENV && process.env.NODE_ENV === 'production';
export const isDevEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isProd =
  isProductionEnv && window.location.host.split('.')[0] === DOMAIN_ENV_PROD;
export const isDev =
  isProductionEnv && window.location.host.split('.')[0] === DOMAIN_ENV_DEV;
export const isTest =
  isProductionEnv && window.location.host.split('.')[0] === DOMAIN_ENV_TEST;
