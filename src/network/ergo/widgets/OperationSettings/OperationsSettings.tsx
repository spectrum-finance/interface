import React, { FC } from 'react';

import { OperationSettings as BaseOperationSettings } from '../../../../components/OperationSettings/OperationSettings';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';

export const OperationsSettings: FC = () => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();

  return <BaseOperationSettings minExFee={minExFee} maxExFee={maxExFee} />;
};
