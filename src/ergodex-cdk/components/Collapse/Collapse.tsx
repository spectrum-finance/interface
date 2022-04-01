import { Collapse as BaseCollapse } from 'antd';
import styled from 'styled-components';

export const Collapse = styled(BaseCollapse)`
  padding: 0;
  border: initial;
  background: var(--ergo-box-bg);
  border-radius: 12px;

  .ant-collapse-item {
    border: initial;
  }

  .ant-collapse-content:last-child {
    border: initial;
    background: var(--ergo-box-bg);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .ant-collapse-header {
    padding: 12px 1rem !important;
  }
`;
