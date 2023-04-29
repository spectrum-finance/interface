import { Modal } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { Farm } from '../../../common/models/Farm';
import { FarmOperationModalHeader } from './FarmOperationModalHeader/FarmOperationModalHeader';

export interface FarmOperationModalProps {
  readonly children?: ReactNode | ReactNode[] | string;
  readonly farm: Farm;
  readonly operation: 'withdrawal' | 'stake';
}

export const FarmOperationModal: FC<FarmOperationModalProps> = ({
  farm,
  operation,
  children,
}) => {
  return (
    <>
      <Modal.Title>
        <FarmOperationModalHeader operation={operation} farm={farm} />
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        {children}
      </Modal.Content>
    </>
  );
};

export const createFarmOperationModal = (
  farm: Farm,
  operation: 'withdrawal' | 'stake',
): ((
  children?: ReactNode | ReactNode[] | string,
) => ReactNode | ReactNode[] | string) => {
  // eslint-disable-next-line react/display-name
  return (children) => {
    return (
      <FarmOperationModal operation={operation} farm={farm}>
        {children}
      </FarmOperationModal>
    );
  };
};
