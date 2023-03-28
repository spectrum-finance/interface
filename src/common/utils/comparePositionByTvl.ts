import { Position } from '../models/Position';

export const comparePositionByTvl = (
  positionA: Position,
  positionB: Position,
): number => {
  if (!positionA.pool.tvl) {
    return 1;
  }
  if (!positionB.pool.tvl) {
    return -1;
  }
  return (
    Number(positionB.pool.tvl.toAmount()) -
    Number(positionA.pool.tvl.toAmount())
  );
};
