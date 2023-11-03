import { t } from '@lingui/macro';

import { OperationValidator } from '../../../../../components/OperationForm/OperationForm';
import { CreateFarmFormModel } from '../CreateFarmFormModel';

const selectPoolValidator: OperationValidator<CreateFarmFormModel> = ({
  value: { pool },
}) => !pool && t`Select pool`;

const selectPeriodValidator: OperationValidator<CreateFarmFormModel> = ({
  value: { period },
}) => !period && t`Select period`;

export const validators: OperationValidator<CreateFarmFormModel>[] = [
  selectPoolValidator,
  selectPeriodValidator,
];
