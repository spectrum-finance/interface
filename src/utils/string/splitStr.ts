/**
 * @usage `const [addressBegin, addressSuffix] = splitStr(address);`
 */
export const splitStr = (
  str: string | null | undefined,
  end = 6,
): [string, string] => {
  if (!str || str.length < end * 2 - 1) {
    return [str!, ''];
  }
  return [str.substring(0, str.length - end), str.substring(str.length - end)];
};
