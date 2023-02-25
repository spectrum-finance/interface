export const isProdEnv = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isDevEnv = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
