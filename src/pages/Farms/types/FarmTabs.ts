import { t } from '@lingui/macro';

export enum FarmTabs {
  AllFarms = 'AllFarms',
  MyFarms = 'MyFarms',
}

export const FarmTabsCaptions = {
  [FarmTabs.AllFarms]: t`All Farms`,
  [FarmTabs.MyFarms]: t`My Farms`,
};
