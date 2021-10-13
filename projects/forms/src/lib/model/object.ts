export type IsEqual<TValue> = (a: TValue, b: TValue) => boolean;

export function keys<TValue>(value: TValue): (keyof TValue)[] {
  return Object.keys(value).map((key) => key as keyof TValue);
}
