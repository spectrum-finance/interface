import React, { CSSProperties } from 'react';
import styled from 'styled-components';

export const ModalContent = styled.div<{ width?: CSSProperties['width'] }>`
  padding: 0 16px 16px;
  width: ${(props) => props.width};
`;
