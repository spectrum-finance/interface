import React, { FC, ReactNode } from 'react';

import {
  Operation,
  OperationStatus,
} from '../../../../common/models/Operation';
import { IsErgo } from '../../../IsErgo/IsErgo';

export interface RefundDecoratorProps {
  readonly item: Operation;
  readonly children: ReactNode | ReactNode[] | string;
}
export const RefundDecorator: FC<RefundDecoratorProps> = ({
  item,
  children,
}) => <IsErgo>{item.status === OperationStatus.Locked && children}</IsErgo>;
