import { Checkbox, Gutter, List } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { FilterControlProps } from '../../common/FilterDescription';

export interface MultiselectFilterItem<T> {
  readonly value: T;
  readonly caption: ReactNode | ReactNode[] | string;
}

export interface MultiselectFilterProps<T> extends FilterControlProps<T> {
  readonly items: MultiselectFilterItem<T>[];
  readonly className?: string;
  readonly padding?: Gutter;
}

export const MultiselectFilter: FC<MultiselectFilterProps<any>> = ({
  items,
  value,
  padding,
  onChange,
}) => {
  const handleChange = (key: any, checked: boolean) => {
    if (!onChange) {
      return;
    }
    const newValue: Set<any> | undefined = value
      ? new Set<any>(Array.from(value))
      : new Set<any>();

    if (checked) {
      newValue!.add(key);
    } else {
      newValue!.delete(key);
    }
    onChange(newValue.size ? newValue : undefined);
  };

  return (
    <List padding={padding || [4, 3]} rowKey="value" dataSource={items} gap={2}>
      {(item) => (
        <div>
          <Checkbox
            checked={value?.has(item.value)}
            onChange={(e) => handleChange(item.value, e.target.checked)}
          >
            {item.caption}
          </Checkbox>
        </div>
      )}
    </List>
  );
};
