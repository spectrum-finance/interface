import { blocksToTimestamp, timestampToBlocks } from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';

export const dateTimeToBlock = (
  currentHeight: number,
  dateTime: DateTime,
): number => timestampToBlocks(currentHeight, dateTime.toMillis());

export const blockToDateTime = (
  currentHeight: number,
  block: number,
): DateTime =>
  DateTime.fromMillis(Number(blocksToTimestamp(currentHeight, block)));
