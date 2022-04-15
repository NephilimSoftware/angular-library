import Spy = jasmine.Spy;

export function wrapCallbackWithSpy<TValue, TResult = void>(callback: (value: TValue) => TResult): Spy {
  const observer: {callback: (value: TValue) => TResult} = {
    callback
  };
  return spyOn(observer, 'callback').and.callThrough();
}


export function createCallbackSpy<TValue>(): Spy {
  const observer: {callback: (value: TValue) => void} = {
    callback: (value) => {},
  };
  return spyOn(observer, 'callback').and.callThrough();
}
