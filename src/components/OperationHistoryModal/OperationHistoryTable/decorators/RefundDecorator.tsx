import React, { FC, ReactNode } from 'react';

import {
  Operation,
  OperationStatus,
} from '../../../../common/models/Operation';

export interface RefundDecoratorProps {
  readonly item: Operation;
  readonly children: ReactNode | ReactNode[] | string;
}
export const RefundDecorator: FC<RefundDecoratorProps> = ({
  item,
  children,
}) => <>{item.status === OperationStatus.Locked && children}</>;
