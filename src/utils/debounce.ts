const noop = (...args: any[]) => {};

export const debounce =
  <F extends (...args: any) => void>(fn: F | undefined, time: number) =>
  (...args: Parameters<F>) => {
    let timerId: any = undefined;
    return (...args: any[]) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout((fn || noop).bind(null, ...args), time);
    };
  };
