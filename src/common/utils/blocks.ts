import { blocksToMillis, millisToBlocks } from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';

export const dateTimeToBlock = (
  currentHeight: number,
  dateTime: DateTime,
): number =>
  currentHeight +
  millisToBlocks(BigInt(dateTime.toMillis() - DateTime.now().toMillis())) +
  1;

export const blockToDateTime = (
  currentHeight: number,
  block: number,
): DateTime =>
  DateTime.now().plus({
    millisecond: Number(blocksToMillis(block - currentHeight - 1)),
  });
