import { Modal } from '@ergolabs/ui-kit';
import React from 'react';

import { CreateFarmModel } from './CreateFarmModel';
interface ConfirmFarmCreateModal {
  value: Required<CreateFarmModel>;
}

export const ConfirmFarmCreateModal: React.FC<{
  value: Required<CreateFarmModel>;
  onClose: (request?: any) => void;
}> = ({ value }) => {
  return (
    <>
      <Modal.Title>Confirm farm</Modal.Title>
      <Modal.Content maxWidth="">git heelllo</Modal.Content>
    </>
  );
};
