import { t } from '@lingui/macro';

import { FarmStatus } from '../../../../common/models/Farm';

export const FarmStateCaptions = {
  [FarmStatus.All]: t`All`,
  [FarmStatus.Live]: t`Live`,
  [FarmStatus.Scheduled]: t`Scheduled`,
  [FarmStatus.Finished]: t`Finished`,
};
