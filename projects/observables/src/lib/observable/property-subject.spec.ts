import Spy = jasmine.Spy;
import {createCallbackSpy} from '../callback.spec';
import {PropertySubject} from './property-subject';
import {PropertySubjectChangedEvent} from './property-subject-changed.event';
import {PropertySubjectChangingEvent} from './property-subject-changing.event';

describe('PropertySubject', () => {
  function createSut(value: string): PropertySubject<string> {
    return new PropertySubject(value);
  }
  const initialValue: string = 'Fura';
  const first: string = 'Janusz';
  const second: string = 'Gawendi';

  describe('get()', () => {
    it('returns initial value when set() was never executed.', () => {
      expect(createSut(initialValue).get()).toEqual(initialValue);
      expect(createSut(first).get()).toEqual(first);
      expect(createSut(second).get()).toEqual(second);
    });
  });

  describe('set(value)', () => {
    let sut: PropertySubject<string>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('changes value returned by get() to one passed in parameter.', () => {
      sut.set(first);
      expect(sut.get()).toEqual(first);
    });
  });

  describe('changed', () => {
    let sut: PropertySubject<string>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('dispatches synchronously when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.changed.subscribe(callback);
      sut.set(first);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(new PropertySubjectChangedEvent(initialValue, first));
      expect(callback).toHaveBeenCalledWith(new PropertySubjectChangedEvent(first, second));
    });

    it("doesn't dispatch when set() was executed with current value", () => {
      const callback: Spy = createCallbackSpy();

      sut.changed.subscribe(callback);
      sut.set(first);
      sut.set(first);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(new PropertySubjectChangedEvent(initialValue, first));
    });
  });

  describe('subscribe', () => {
    let sut: PropertySubject<string>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('dispatches synchronously with initial value when set() was not executed.', () => {
      const callback: Spy = createCallbackSpy();
      const currentValue: string = sut.get();

      sut.subscribe(callback);

      expect(callback).toHaveBeenCalledOnceWith(currentValue);
    });

    it('dispatches synchronously when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.subscribe(callback);
      sut.set(first);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(initialValue);
      expect(callback).toHaveBeenCalledWith(first);
      expect(callback).toHaveBeenCalledWith(second);
    });

    it("doesn't dispatch synchronously when set() was executed with the same value.", () => {
      const callback: Spy = createCallbackSpy();

      sut.subscribe(callback);
      sut.set(first);
      sut.set(first);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(initialValue);
      expect(callback).toHaveBeenCalledWith(first);
    });

    it('dispatches synchronously with latest version when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.set(first);
      sut.subscribe(callback);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(first);
      expect(callback).toHaveBeenCalledWith(second);
    });
  });

  describe('changing', () => {
    it('dispatches synchronously whe set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe(callback);
      sut.set('Gawendi');
      sut.set('Fura');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(new PropertySubjectChangingEvent('Janusz', 'Gawendi'));
      expect(callback).toHaveBeenCalledWith(new PropertySubjectChangingEvent('Gawendi', 'Fura'));
    });

    it("doesn't dispatch synchronously whe set() was executed with the same value.", () => {
      const callback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe(callback);
      sut.set('Fura');
      sut.set('Fura');

      expect(callback).toHaveBeenCalledOnceWith(new PropertySubjectChangingEvent('Janusz', 'Fura'));
    });

    it('prevents changed from dispatching when event.cancel() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe((event) => event.cancel());
      sut.changed.subscribe(callback);
      sut.set('Fura');

      expect(callback).not.toHaveBeenCalled();
    });

    it('prevents observable from dispatching when event.cancel() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe((event) => event.cancel());
      sut.subscribe(callback);
      sut.set('Fura');

      expect(callback).toHaveBeenCalledOnceWith('Janusz');
    });

    it('prevents next callbacks from calling when event.cancel() was executed.', () => {
      const firstCallback: Spy = createCallbackSpy();
      const secondCallback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe(firstCallback);
      sut.changing.subscribe((event) => {
        expect(event.wasCancelled).toBeFalse();
        event.cancel();
      });
      sut.changing.subscribe(secondCallback);
      sut.set('Fura');

      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).not.toHaveBeenCalled();
    });

    it('throws error when event.cancelAndThrow was executed in handler', () => {
      class TestError extends Error {
        public constructor() {
          super('Test');
        }
      }

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe((event) => {
        event.cancelAndThrow(new TestError());
      });

      expect(() => sut.set('Fura')).toThrowMatching((error) => error instanceof TestError);
    });

    it('prevents next callbacks from executing when event.cancelAndThrow was executed in handler', () => {
      class TestError extends Error {
        public constructor() {
          super('Test');
        }
      }

      const callback: Spy = createCallbackSpy();

      const sut: PropertySubject<string> = new PropertySubject('Janusz');
      sut.changing.subscribe((event) => {
        event.cancelAndThrow(new TestError());
      });
      sut.changing.subscribe(callback);

      try {
        sut.set('Fura');
      } catch (e) {}

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
