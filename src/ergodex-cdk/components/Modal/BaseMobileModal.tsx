import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { CupertinoPaneContainer } from './CupertinoPaneContainer';

const ModalTitleContainer = styled.div`
  padding: 8px 16px;
`;

interface MobileDialogProps {
  visible: boolean;
  onClose?(): void;
  title?: ReactNode;
  footer?: ReactNode;
  afterClose?: () => void;
}

export const BaseMobileModal: React.FC<MobileDialogProps> = ({
  children,
  visible,
  onClose,
  title,
  footer,
  afterClose,
}) => {
  return (
    <CupertinoPaneContainer
      onBackdropTap={() => {
        onClose?.();
        afterClose?.();
      }}
      onDidDismiss={() => {
        onClose?.();
        afterClose?.();
      }}
      visible={visible}
    >
      {title && <ModalTitleContainer>{title}</ModalTitleContainer>}
      {children}
      {footer}
    </CupertinoPaneContainer>
  );
};
