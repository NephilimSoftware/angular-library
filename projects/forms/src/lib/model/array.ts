export function flatten<TItem>(array: TItem[][]): TItem[] {
  return ([] as TItem[]).concat.apply([], array);
}

export function isEqual<TItem>(
  a: TItem[],
  b: TItem[],
  isItemEqual: (i1: TItem, i2: TItem) => boolean = (i1, i2) => i1 === i2
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i: number = 0; i < a.length; i++) {
    if (!isItemEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

export function hasTheSameItems<TItem>(
  a: TItem[],
  b: TItem[],
  isItemEqual: (i1: TItem, i2: TItem) => boolean = (i1, i2) => i1 === i2
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return isEqual(a.concat().sort(), b.concat().sort(), isItemEqual);
}
