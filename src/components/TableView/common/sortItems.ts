import { Column } from './Column';
import { Sort, SortDirection } from './Sort';

export const sortItems = (
  sort: Sort | undefined,
  columns: Column<any>[],
  items: any[],
): any[] => {
  console.log(sort);
  if (!sort) {
    return items;
  }
  const sortBy = columns[sort.column].sortBy!;

  return items.slice().sort((itemA: any, itemB: any) => {
    const itemAValue = sortBy(itemA);
    const itemBValue = sortBy(itemB);

    if (itemAValue > itemBValue) {
      return sort.direction === SortDirection.ASC ? -1 : 1;
    }
    if (itemBValue > itemAValue) {
      return sort.direction === SortDirection.ASC ? 1 : -1;
    }
    return 1;
  });
};
