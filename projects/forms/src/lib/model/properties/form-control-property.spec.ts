import Spy = jasmine.Spy;
import {FormPropertyChangingEvent} from '../../events/form-property-changing.event';
import {qualityCheckFormControlProperty} from '../api.spec';
import {createCallbackSpy} from '../callback.spec';
import {FormControlProperty} from './form-control-property';

describe('FormProperty', () => {
  qualityCheckFormControlProperty((v) => new FormControlProperty(v), 'Fura', 'Janusz', 'Gawendi');

  describe('changing', () => {
    it('dispatches synchronously whe set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
      sut.changing.subscribe(callback);
      sut.set('Gawendi');
      sut.set('Fura');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangingEvent('Janusz', 'Gawendi'));
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangingEvent('Gawendi', 'Fura'));
    });

    it("doesn't dispatch synchronously whe set() was executed with the same value.", () => {
      const callback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
      sut.changing.subscribe(callback);
      sut.set('Fura');
      sut.set('Fura');

      expect(callback).toHaveBeenCalledOnceWith(new FormPropertyChangingEvent('Janusz', 'Fura'));
    });

    it('prevents changed from dispatching when event.cancel() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
      sut.changing.subscribe((event) => event.cancel());
      sut.changed.subscribe(callback);
      sut.set('Fura');

      expect(callback).not.toHaveBeenCalled();
    });

    it('prevents observable from dispatching when event.cancel() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
      sut.changing.subscribe((event) => event.cancel());
      sut.subscribe(callback);
      sut.set('Fura');

      expect(callback).toHaveBeenCalledOnceWith('Janusz');
    });

    it('prevents next callbacks from calling when event.cancel() was executed.', () => {
      const firstCallback: Spy = createCallbackSpy();
      const secondCallback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
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
        constructor() {
          super('Test');
        }
      }

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
      sut.changing.subscribe((event) => {
        event.cancelAndThrow(new TestError());
      });

      expect(() => sut.set('Fura')).toThrowMatching((error) => error instanceof TestError);
    });

    it('prevents next callbacks from executing when event.cancelAndThrow was executed in handler', () => {
      class TestError extends Error {
        constructor() {
          super('Test');
        }
      }

      const callback: Spy = createCallbackSpy();

      const sut: FormControlProperty<string> = new FormControlProperty('Janusz');
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
