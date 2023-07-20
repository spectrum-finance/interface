import { Flex } from '@ergolabs/ui-kit';

export const makeSkeletonLoader = (
  Component: React.ReactNode,
  numOfCopies: number,
) => {
  return (
    <Flex col>
      {Array(numOfCopies)
        .fill(Component)
        .map((Cmp, index) => (
          <Flex.Item marginBottom={1} key={index}>
            {Cmp}
          </Flex.Item>
        ))}
    </Flex>
  );
};
