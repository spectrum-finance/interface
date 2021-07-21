export const truncate = (id: string): string => {
  return `${id.slice(0, 16)}...${id.slice(48)}`;
};
