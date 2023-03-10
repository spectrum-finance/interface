import {
  Button,
  ButtonProps,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  Flex,
  LeftOutlined,
  RightOutlined,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

const _PaginationButton: FC<ButtonProps & { active?: boolean }> = ({
  ...rest
}) => <Button {...rest} />;

const PaginationButton = styled(_PaginationButton)`
  &.ant-btn:disabled,
  &.ant-btn-lg:disabled,
  &.ant-btn.ant-btn-sm:disabled,
  &.ant-btn-icon-only:disabled,
  &.ant-btn.ant-btn-text:disabled,
  &.ant-btn:disabled:active,
  &.ant-btn-lg:disabled:active,
  &.ant-btn.ant-btn-sm:disabled:active,
  &.ant-btn-icon-only:disabled:active,
  &.ant-btn.ant-btn-text:disabled:active,
  &.ant-btn:disabled:focus,
  &.ant-btn-lg:disabled:focus,
  &.ant-btn.ant-btn-sm:disabled:focus,
  &.ant-btn-icon-only:disabled:focus,
  &.ant-btn.ant-btn-text:disabled:focus,
  &.ant-btn:disabled:hover,
  &.ant-btn-lg:disabled:hover,
  &.ant-btn.ant-btn-sm:disabled:hover,
  &.ant-btn-icon-only:disabled:hover,
  &.ant-btn.ant-btn-text:disabled:hover,
  &.ant-btn:disabled .ant-btn-loading,
  &.ant-btn-lg:disabled .ant-btn-loading,
  &.ant-btn.ant-btn-sm:disabled .ant-btn-loading,
  &.ant-btn-icon-only:disabled .ant-btn-loading,
  &.ant-btn.ant-btn-text:disabled .ant-btn-loading {
    background: transparent !important;
    border-color: transparent !important;
  }

  ${(props) =>
    props.active
      ? css`
          color: var(--spectrum-primary-color) !important;
          border-color: var(--spectrum-primary-color) !important;
        `
      : css`
          border-color: transparent !important;
        `}
`;

export interface OperationPaginationProps {
  readonly limit: number;
  readonly offset: number;
  readonly total: number;
  readonly onOffsetChange: (newOffset: number) => void;
}

export const OperationPagination: FC<OperationPaginationProps> = ({
  limit,
  offset,
  total,
  onOffsetChange,
}) => {
  const pageCount = Math.ceil(total / limit);
  const activePage = Math.ceil(offset / limit) + 1;
  const pagesRange = new Array(pageCount).fill(undefined).map((_, i) => i + 1);

  let displayedPages: number[];
  const isActivePageOnLeftSide = activePage < 3;
  const isActivePageOnRightSide = activePage > pageCount - 2;

  const handlePageSelect = (page: number) => {
    onOffsetChange(page * limit - limit);
  };

  if (pageCount <= 5) {
    displayedPages = pagesRange;
  } else if (isActivePageOnLeftSide) {
    displayedPages = pagesRange.slice(0, 5);
  } else if (isActivePageOnRightSide) {
    displayedPages = pagesRange.slice(pageCount - 5, pageCount);
  } else {
    displayedPages = [
      activePage - 2,
      activePage - 1,
      activePage,
      activePage + 1,
      activePage + 2,
    ];
  }
  const isActivePageFirst = activePage === 1;
  const isActivePageLast = activePage === pageCount;

  return (
    <Flex align="center" justify="center">
      <Flex.Item marginRight={1}>
        <PaginationButton
          onClick={() => handlePageSelect(1)}
          width={24}
          disabled={isActivePageFirst}
          icon={<DoubleLeftOutlined />}
        />
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <PaginationButton
          onClick={() => handlePageSelect(activePage - 1)}
          width={24}
          disabled={isActivePageFirst}
          icon={<LeftOutlined />}
        />
      </Flex.Item>
      {displayedPages.map((page, i) => (
        <Flex.Item key={page} marginRight={1}>
          <PaginationButton
            width={34}
            onClick={() => handlePageSelect(page)}
            active={page === activePage}
            type="default"
            htmlType="button"
            size="small"
          >
            {page}
          </PaginationButton>
        </Flex.Item>
      ))}
      <Flex.Item marginRight={1}>
        <PaginationButton
          onClick={() => handlePageSelect(activePage + 1)}
          width={24}
          disabled={isActivePageLast}
          icon={<RightOutlined />}
        />
      </Flex.Item>
      <Flex.Item>
        <PaginationButton
          onClick={() => handlePageSelect(pageCount)}
          width={24}
          disabled={isActivePageLast}
          icon={<DoubleRightOutlined />}
        />
      </Flex.Item>
    </Flex>
  );
};
