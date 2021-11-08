const noop = (...args: any[]) => {};

export const debounce =
  <F extends (...args: any) => void>(fn: F | undefined, time: number) =>
  (...args: Parameters<F>) => {
    let timerId: any = undefined;
    console.log('here');
    return (...args: any[]) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      console.log('here');
      timerId = setTimeout((fn || noop).bind(null, ...args), time);
    };
  };
