import { Dictionary } from '../../../common/utils/Dictionary';
import { Column } from './Column';
import { FilterState } from './Filter';

export const filterItem = (
  item: any,
  column: Column<any>,
  columnNum: number,
  filtersState: Dictionary<FilterState<any>>,
) => {
  const filterStateArray = Object.values(filtersState);

  if (!filterStateArray.length || !column.match) {
    return true;
  }

  return column.match(filtersState[columnNum]?.value, item);
};
