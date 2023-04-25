import { Animation, getGutter, Gutter } from '@ergolabs/ui-kit';
import last from 'lodash/last';
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AutoSizer } from 'react-virtualized';
import {
  List as VirtualizedList,
  ListRowRenderer,
} from 'react-virtualized/dist/es/List';
import styled from 'styled-components';

import { uint } from '../../common/types';
import { Dictionary } from '../../common/utils/Dictionary';
import { Expand } from './common/Expand';
import { ListItem, ListItemFn } from './common/ListItem';
import { ListState } from './common/ListState';
import { ListContext } from './ListContext/ListContext';
import { getHeight } from './utils/getHeight';
import { getRowHeight } from './utils/getRowHeight';

const ItemContainer = styled.div`
  transition: all 0.3s;
`;

export interface EmptyGroupConfig<T> {
  readonly items: T[];
}

export interface GroupConfig<T> {
  readonly title: ReactNode | ReactNode[] | string;
  readonly height: number;
  readonly items: T[];
}

interface ItemsData<T> {
  readonly items: (T | ReactNode[] | ReactNode | string)[];
  readonly groups: Dictionary<{ name: string; height: number }>;
}

function isGroupConfig<T>(
  group: GroupConfig<T> | EmptyGroupConfig<T>,
): group is GroupConfig<T> {
  return !!(group as any)?.title;
}

function toItemsData<T>(
  items: T[] | Dictionary<GroupConfig<T> | EmptyGroupConfig<T>>,
): ItemsData<T> {
  if (items instanceof Array) {
    return { items, groups: {} };
  }

  return Object.entries(items).reduce<ItemsData<T>>(
    (itemsData, [key, group]) => {
      if (isGroupConfig(group)) {
        return {
          items: itemsData.items.concat(group.title).concat(group.items),
          groups: {
            ...itemsData.groups,
            [itemsData.items.length]: {
              name: key,
              height: group.height,
            },
          },
        };
      }
      return {
        items: itemsData.items.concat(group.items),
        groups: itemsData.groups,
      };
    },
    { items: [], groups: {} },
  );
}

export interface ListProps<T> {
  readonly height?: CSSProperties['height'];
  readonly maxHeight?: CSSProperties['height'];
  readonly gap?: uint;
  readonly padding?: Gutter;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly overlay?: boolean;
  readonly items: T[] | Dictionary<GroupConfig<T> | EmptyGroupConfig<T>>;
  readonly itemHeight: number;
  readonly itemKey: keyof T | ((item: T) => string);
  readonly expand?: Expand;
  readonly fadeInDelay?: number;
  readonly children:
    | ((childProps: ListItem<T>) => ReactNode | ReactNode[] | string)
    | (
        | ((childProps: ListItem<T>) => ReactNode | ReactNode[] | string)
        | ReactNode
      )[];
}

export const List = <T,>({
  maxHeight,
  height,
  style,
  className,
  gap,
  padding,
  itemHeight,
  items,
  children,
  itemKey,
  expand,
  fadeInDelay,
}: ListProps<T>): ReactElement => {
  const ref = useRef<VirtualizedList>();

  const [selectedItems, setSelectedItems] = useState<uint[]>([]);

  const [states, setStates] = useState<Dictionary<ListState>>({});

  const [itemsData, setItemsData] = useState<ItemsData<T>>(toItemsData(items));

  const itemRenderer: (props: ListItem<T>) => ReactNode | ReactNode[] | string =
    children instanceof Array
      ? (children.find((c) => c instanceof Function) as ListItemFn<T>)
      : children;

  const statesRenderer =
    children instanceof Array
      ? children.filter((c) => !(c instanceof Function))
      : [];

  const currentState = Object.values(states).find((sr) => sr.condition);

  const isTitle = (
    _: T | ReactNode | ReactNode[] | string,
    index: uint,
  ): _ is ReactNode | ReactNode[] | string => {
    return !!itemsData.groups[index];
  };

  useEffect(() => {
    setItemsData(toItemsData(items));
  }, [items]);

  useEffect(() => {
    ref.current?.recomputeRowHeights();
  }, [itemsData]);

  useEffect(() => {
    ref.current?.recomputeRowHeights();
  }, [selectedItems]);

  const handleExpand = (currentIndex: uint) => {
    if (!expand) {
      return;
    }
    if (expand.accordion) {
      setSelectedItems([currentIndex]);
    } else {
      setSelectedItems(selectedItems.concat(currentIndex));
    }
  };

  const handleCollapse = (currentIndex: uint) => {
    if (!expand) {
      return;
    }
    setSelectedItems(selectedItems.filter((index) => index !== currentIndex));
  };

  const addListState = (s: ListState): void => {
    setStates((prev) => ({ ...prev, [s.name]: s }));
  };

  const getGroupByIndex = (itemIndex: uint): string | undefined => {
    const possibleGroups = Object.entries(itemsData.groups)
      .filter(([index]) => +index < itemIndex)
      .map(([, value]) => value.name);

    return last(possibleGroups);
  };

  const listItemRenderer: ListRowRenderer = ({ index, key, style }) => {
    const item = itemsData.items[index];
    const isItemSelected = selectedItems.includes(index);

    if (isTitle(item, index)) {
      return (
        <ItemContainer style={style} key={itemsData.groups[index].name || key}>
          <Animation.FadeIn delay={fadeInDelay || 0}>{item}</Animation.FadeIn>
        </ItemContainer>
      );
    }

    const getKey = (item: T, itemKey: keyof T | ((item: T) => string)) => {
      if (itemKey instanceof Function) {
        return itemKey(item);
      }
      return (item[itemKey] as any) || key;
    };

    return (
      <ItemContainer style={style} key={getKey(item, itemKey)}>
        {itemRenderer && (
          <Animation.FadeIn delay={fadeInDelay || 0}>
            {itemRenderer({
              item,
              index,
              height: isItemSelected
                ? itemHeight + (expand?.height || 0)
                : itemHeight,
              itemHeight: itemHeight,
              expandHeight: expand?.height || 0,
              expanded: selectedItems.includes(index),
              expand: handleExpand.bind(null, index),
              collapse: handleCollapse.bind(null, index),
              group: getGroupByIndex(index),
            })}
          </Animation.FadeIn>
        )}
      </ItemContainer>
    );
  };

  return (
    <ListContext.Provider value={{ states: states, addState: addListState }}>
      {currentState ? (
        currentState.children
      ) : (
        <div
          className={className}
          style={{
            ...style,
            padding: getGutter(padding || 0),
            position: 'relative',
          }}
        >
          {/*{(!!height || !!maxHeight) && overlay && (*/}
          {/*  <Overlay position={overlayPosition} />*/}
          {/*)}*/}
          <div
            style={{
              height: getHeight(
                height,
                maxHeight,
                expand?.height || 0,
                itemsData.items.length,
                selectedItems.length,
                itemHeight,
                itemsData.groups,
                gap,
              ),
            }}
          >
            <AutoSizer>
              {({ width, height }) => (
                <VirtualizedList
                  ref={ref as any}
                  height={height}
                  width={width}
                  rowHeight={({ index }) =>
                    getRowHeight(
                      index,
                      itemsData.items.length,
                      selectedItems,
                      itemHeight,
                      expand?.height || 0,
                      itemsData.groups,
                      gap,
                    )
                  }
                  rowRenderer={listItemRenderer}
                  rowCount={itemsData.items.length}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      )}
      {statesRenderer}
    </ListContext.Provider>
  );
};
