function getConstructor(value: any): Function | undefined {
  return value.constructor;
}

export function valueEquals<TValue>(a: TValue, b: TValue): boolean {
  if (a === b) {
    return true;
  }

  const isANotDefined: boolean = a === undefined || a === null;
  const isBNotDefined: boolean = b === undefined || b === null;
  if (isANotDefined || isBNotDefined) {
    return isANotDefined && isBNotDefined;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  if (getConstructor(a) !== getConstructor(b)) {
    return false;
  }


  const aKeys: string[] = Object.keys(a);
  const bKeys: string[] = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return (
    Object.keys(a)
      .map((key) => key as keyof TValue)
      .find((key) => !valueEquals(a[key], b[key])) === undefined
  );
}
