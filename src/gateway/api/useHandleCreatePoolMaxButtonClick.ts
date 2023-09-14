import { FormGroup } from '@ergolabs/ui-kit';

import { Balance } from '../../common/models/Balance';
import { CreatePoolFormModel } from '../../pages/CreatePool/CreatePoolFormModel';
import { useSelectedNetwork } from '../common/network';

export const useHandleCreatePoolMaxButtonClick = (): ((
  pct: number,
  form: FormGroup<CreatePoolFormModel>,
  balance: Balance,
) => void) => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useHandleCreatePoolMaxButtonClick();
};
