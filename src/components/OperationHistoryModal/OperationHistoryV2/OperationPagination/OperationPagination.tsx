import { Button, ButtonProps, Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

const _PaginationButton: FC<ButtonProps & { active?: boolean }> = ({
  ...rest
}) => <Button {...rest} />;

const PaginationButton = styled(_PaginationButton)`
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

  return (
    <Flex align="center" justify="center">
      {displayedPages.map((page, i) => (
        <Flex.Item
          key={page}
          marginRight={displayedPages.length - 1 === i ? 0 : 1}
        >
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
    </Flex>
  );
};
