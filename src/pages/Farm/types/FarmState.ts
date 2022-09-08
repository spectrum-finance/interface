import { t } from '@lingui/macro';

export enum FarmTab {}

export enum FarmState {
  All = 'All',
  Live = 'Live',
  Scheduled = 'Scheduled',
  Finished = 'Finished',
}

export const FarmStateCaptions = {
  [FarmState.All]: t`All`,
  [FarmState.Live]: t`Live`,
  [FarmState.Scheduled]: t`Scheduled`,
  [FarmState.Finished]: t`Finished`,
};
